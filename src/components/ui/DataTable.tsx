'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Search } from 'lucide-react';
import { cn } from "@/src/lib/cn";
import { useDataTable } from "@/src/hooks/useDataTable";

export interface TableColumn<T> {
    header: string;
    sortKey?: keyof T;
    renderCell: (item: T, index: number) => React.ReactNode; // Tempat custom isi td (text, badge, button, dll)
    className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
    dataAwal: T[];
    columns: TableColumn<T>[];
    searchKeys: (keyof T)[];
    filenameExport?: string;
    excelMapping: (item: T, idx: number) => Record<string, unknown>;
    pdfMapping: (item: T, idx: number) => (string | number)[];
}

export default function DataTable<T extends Record<string, unknown>>({
    dataAwal,
    columns,
    searchKeys,
    filenameExport = "export-data",
    excelMapping,
    pdfMapping
}: DataTableProps<T>) {
    
    const {
        searchQuery, setSearchQuery,
        sortConfig, handleSort,
        paginatedData, sortedData,
        currentPage, setCurrentPage,
        itemsPerPage, setItemsPerPage,
        totalPages, exportExcel, exportPDF
    } = useDataTable<T>({
        dataAwal,
        searchKeys,
        filenameExport
    });

    const handleDownloadExcel = () => exportExcel(excelMapping);
    const handleDownloadPDF = () => {
        const headers = [['No', ...columns.map(c => c.header)]];
        exportPDF(headers, pdfMapping);
    };

    const renderIcon = (key: keyof T) => {
        if (sortConfig?.key !== key) return <ArrowUpDown size={14} className="opacity-30" />;
        return sortConfig.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    return (
        <div className="space-y-4 w-full">
            <div className={cn("rounded-box border border-base-300 bg-base-100 overflow-hidden flex flex-col")}>
                <div className="border-b border-base-300 p-3 bg-base-100 z-10">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        <div className="relative w-full max-w-[300px]">
                            <div className="absolute z-50 top-2.5 left-2.5 text-gray-500">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="input border-0 bg-base-200 w-full px-10 input-md"
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto justify-end">
                            <button 
                                onClick={handleDownloadExcel} 
                                className={cn(
                                    "flex justify-center items-center gap-2 bg-secondary py-2 px-3 text-xs font-bold",
                                    "text-secondary-content rounded-md cursor-pointer",
                                    "hover:bg-secondary/90"
                                )}
                            >
                                <Download size={14} /> Excel
                            </button>
                            <button 
                                onClick={handleDownloadPDF} 
                                className={cn(
                                    "flex justify-center items-center gap-2 bg-secondary py-2 px-3 text-xs font-bold",
                                    "text-secondary-content rounded-md cursor-pointer",
                                    "hover:bg-secondary/90"
                                )}
                            >
                                <Download size={14} /> PDF
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className={cn("overflow-auto max-h-[390px]")}>
                    <table className="table table-hovered table-pin-rows">
                        <thead>
                            <tr>
                                <th className="bg-base-100 text-center w-[60px]"></th>
                                {/* 2. Render Header Secara Dinamis */}
                                {columns.map((col, idx) => {
                                    if (col.sortKey) {
                                        return (
                                            <th 
                                                key={idx} 
                                                className={cn("text-center bg-base-100 cursor-pointer select-none hover:bg-base-200", col.className)} 
                                                onClick={() => handleSort(col.sortKey!)}
                                            >
                                                <div className="flex items-center justify-center gap-1">
                                                    {col.header} {renderIcon(col.sortKey)}
                                                </div>
                                            </th>
                                        );
                                    }
                                    return (
                                        <th key={idx} className={cn("text-center bg-base-100", col.className)}>
                                            {col.header}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((item, index) => {
                                    const nomorBaris = (currentPage - 1) * itemsPerPage + index + 1;
                                    return (
                                        <tr key={index} className="hover:bg-base-200">
                                            <th className="text-center">{nomorBaris}</th>
                                            {/* 3. Render Kolom Baris Secara Dinamis */}
                                            {columns.map((col, colIdx) => (
                                                <td key={colIdx} className={col.className}>
                                                    {col.renderCell(item, index)}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + 1} className="text-center py-5 text-base-content/50 italic text-sm">
                                        No data available in table
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="border-t border-base-300 p-3 bg-base-100 z-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs px-1">
                        <div className="flex items-center gap-2">
                            <span>Show</span>
                            <select 
                                className="select select-bordered select-sm" 
                                value={itemsPerPage} 
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                            </select>
                            <span className="min-w-[100px]">entry of {sortedData.length} data</span>
                        </div>
                        <div className="join">
                            <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
                            <button className="join-item btn btn-sm no-animation bg-base-200 w-[100px]">Page {currentPage} / {totalPages || 1}</button>
                            <button className="join-item btn btn-sm" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
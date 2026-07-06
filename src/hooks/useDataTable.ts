'use client';

import { useState, useMemo } from 'react';

interface UseDataTableOptions<T> {
    dataAwal: T[];
    searchKeys: (keyof T)[];
    filenameExport?: string;
}

export function useDataTable<T extends Record<string, unknown>>({
    dataAwal,
    searchKeys,
    filenameExport = "export-data"
}: UseDataTableOptions<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // 1. Handle Sort Trigger
    const handleSort = (key: keyof T) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // 2. Logic Filter Search
    const filteredData = useMemo(() => {
        // Tambahkan pelindung (dataAwal || []) di sini
        const dataAman = dataAwal || []; 
        
        return dataAman.filter((item) => {
            if (!searchQuery) return true;
            const keyword = searchQuery.toLowerCase();
            return searchKeys.some((key) => {
                const val = item[key];
                return val ? String(val).toLowerCase().includes(keyword) : false;
            });
        });
    }, [dataAwal, searchQuery, searchKeys]);

    // 3. Logic Sorting
    const sortedData = useMemo(() => {
        const urutanData = [...filteredData];
        if (sortConfig !== null) {
            urutanData.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return urutanData;
    }, [filteredData, sortConfig]);

    // 4. Logic Pagination
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    // 5. Export Excel (Reusable)
    const exportExcel = async (mappingFunction: (data: T, idx: number) => Record<string, unknown>) => {
        const { utils, writeFile } = await import('xlsx');
        const dataToExcel = sortedData.map((item, idx) => mappingFunction(item, idx));
        const ws = utils.json_to_sheet(dataToExcel);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Sheet1");
        writeFile(wb, `${filenameExport}.xlsx`);
    };

    // 6. Export PDF (Reusable)
    const exportPDF = async (headers: string[][], mappingFunction: (item: T, idx: number) => (string | number)[]) => {
        const { default: jsPDF } = await import('jspdf');
        const { default: autoTable } = await import('jspdf-autotable');
        const doc = new jsPDF();
        const rows = sortedData.map((item, idx) => mappingFunction(item, idx));
        autoTable(doc, { head: headers, body: rows });
        doc.save(`${filenameExport}.pdf`);
    };

    return {
        searchQuery,
        setSearchQuery,
        sortConfig,
        handleSort,
        paginatedData,
        sortedData,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        exportExcel,
        exportPDF
    };
}
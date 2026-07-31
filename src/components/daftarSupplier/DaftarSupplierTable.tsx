'use client';

import DataTable, { TableColumn } from "@/src/components/ui/DataTable";
import { cn } from "@/src/lib/cn";
import { SessionPayload } from "@/src/types/auth";
import { DaftarSupplier } from "@/src/types/menu";
import { SquarePen } from "lucide-react";

type TableSupplier = DaftarSupplier & Record<string, unknown>;

interface DaftarSupplierTableProps {
    dataAwal: DaftarSupplier[];
    onEdit: (supplier: DaftarSupplier) => void;
    session: SessionPayload | null;
}

export default function DaftarSupplierTable({ dataAwal, onEdit, session }: DaftarSupplierTableProps) {
    const isAdmin = session?.role === "Admin";
    const isKasir = session?.role === "Kasir";
    const canEdit = isAdmin || isKasir;

    const actionColumn: TableColumn<TableSupplier> = {
        header: 'ACTION',
        className: 'text-center',
        renderCell: (p) => (
            <div className="tooltip" data-tip="Edit">
                <button 
                    className={cn(
                        "p-1.5 rounded cursor-pointer",
                        "hover:bg-base-300"
                    )}
                    onClick={() => onEdit(p)}
                >
                    <SquarePen size={20}/>
                </button> 
            </div>
        )
    };
    
    const dataColumns: TableColumn<TableSupplier>[] = [
        { 
            header: 'KODE', 
            sortKey: 'kode', 
            className: 'text-center min-w-[100px]',
            renderCell: (p) => p.kode 
        },
        { 
            header: 'NAMA', 
            sortKey: 'nama', 
            className: 'text-start min-w-[250px]',
            renderCell: (p) => p.nama 
        },
        { 
            header: 'ALAMAT', 
            sortKey: 'alamat', 
            className: 'text-start min-w-[300px]',
            renderCell: (p) => p.alamat
        },
    ];

    const columns: TableColumn<TableSupplier>[] = canEdit
        ? [actionColumn, ...dataColumns]
        : dataColumns;

    return (
        <DataTable<TableSupplier>
            dataAwal={dataAwal as TableSupplier[]}
            columns={columns}
            searchKeys={['kode', 'nama', 'alamat']}
            filenameExport="Daftar_Supplier"
            excelMapping={(p, idx) => ({
                No: idx + 1,
                Kode: p.kode,
                Nama: p.nama,
                Alamat: p.alamat
            })}
            pdfMapping={(p, idx) => [
                idx + 1, 
                String(p.kode), 
                p.nama, 
                p.alamat
            ]}
        />
    );
}
'use client';

import DataTable, { TableColumn } from "@/src/components/common/DataTable";
import { cn } from "@/src/lib/cn";
import { DaftarPelanggan } from "@/src/types/menu";
import { SquarePen } from "lucide-react";

type TablePelanggan = DaftarPelanggan & Record<string, unknown>;

interface DaftarPelangganTableProps {
    dataAwal: DaftarPelanggan[];
    onEdit: (pelanggan: DaftarPelanggan) => void;
}

export default function DaftarPelangganTable({ dataAwal , onEdit}: DaftarPelangganTableProps) {
    
    const columns: TableColumn<TablePelanggan>[] = [
        { 
            header: 'KODE', 
            sortKey: 'kode', 
            className: 'text-center',
            renderCell: (p) => p.kode 
        },
        { 
            header: 'NAMA', 
            sortKey: 'nama', 
            className: 'text-start min-w-[250px]',
            renderCell: (p) => p.nama 
        },
        { 
            header: 'GROUP PELANGGAN', 
            sortKey: 'idKategori', 
            className: 'text-center',
            renderCell: (p) => p.idKategori === 1 ? "Anggota" : "Non Anggota" 
        },
        { 
            header: 'LIMIT BELANJA', 
            sortKey: 'limitBelanja', 
            className: 'text-center',
            renderCell: (p) => p.limitBelanja?.toLocaleString("id-ID") ?? 0 
        },
        { 
            header: 'KREDIT', 
            sortKey: 'kredit', 
            className: 'text-center',
            renderCell: (p) => p.kredit === 1 ? "Ya" : "Tidak" 
        },
        { 
            header: 'ACTION', 
            className: 'text-center',
            renderCell: (p) => (
                <button 
                    className={cn(
                        "p-1.5 rounded cursor-pointer",
                        "hover:bg-base-300"
                    )}
                    onClick={() => onEdit(p)}
                >
                    <SquarePen size={20}/>
                </button> 
            )
        },
    ];

    return (
        <DataTable<TablePelanggan>
            dataAwal={dataAwal as TablePelanggan[]}
            columns={columns}
            searchKeys={['kode', 'nama']}
            filenameExport="Daftar_Pelanggan"
            excelMapping={(p, idx) => ({
                No: idx + 1,
                Kode: p.kode,
                Nama: p.nama,
                Group: p.idKategori === 1 ? "Anggota" : "Non Anggota",
                Limit: p.limitBelanja ?? 0,
                Kredit: p.kredit === 1 ? "Ya" : "Tidak"
            })}
            pdfMapping={(p, idx) => [
                idx + 1, 
                String(p.kode), 
                p.nama, 
                p.idKategori === 1 ? "Anggota" : "Non Anggota", 
                p.limitBelanja ?? 0, 
                p.kredit === 1 ? "Ya" : "Tidak"
            ]}
        />
    );
}
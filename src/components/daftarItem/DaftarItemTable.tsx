'use client';

import DataTable, { TableColumn } from "@/src/components/ui/DataTable";
import { cn } from "@/src/lib/cn";
import { DaftarItem } from "@/src/types/menu";
import { SquarePen } from "lucide-react";

type TableItem = DaftarItem & Record<string, unknown>;

interface DaftarItemTableProps {
    dataAwal: DaftarItem[];
    onEdit: (item: DaftarItem) => void;
}

export default function DaftarItemTable({ dataAwal, onEdit }: DaftarItemTableProps) {
    
    const columns: TableColumn<TableItem>[] = [
        { 
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
        },
        { 
            header: 'KODE', 
            sortKey: 'kode', 
            className: 'text-center min-w-[100px]',
            renderCell: (p) => p.kode 
        },
        { 
            header: 'BARCODE', 
            sortKey: 'barcode', 
            className: 'text-center',
            renderCell: (p) => p.barcode 
        },
        { 
            header: 'NAMA ITEM', 
            sortKey: 'nama', 
            className: 'text-start min-w-[250px]',
            renderCell: (p) => p.nama
        },
        { 
            header: 'STOK', 
            sortKey: 'stok', 
            className: 'text-center',
            renderCell: (p) => p.stok
        },
        { 
            header: 'SATUAN', 
            sortKey: 'satuan', 
            className: 'text-center',
            renderCell: (p) => p.satuan 
        },
        { 
            header: 'RAK', 
            sortKey: 'rak', 
            className: 'text-center',
            renderCell: (p) => p.rak 
        },
        { 
            header: 'JENIS', 
            sortKey: 'jenis', 
            className: 'text-center',
            renderCell: (p) => p.jenis 
        },
        { 
            header: 'HARGA BELI', 
            sortKey: 'hargaBeli', 
            className: 'text-right',
            renderCell: (p) => p.hargaBeli.toLocaleString("id-ID")
        },
        { 
            header: 'HARGA JUAL', 
            sortKey: 'hargaJual', 
            className: 'text-right',
            renderCell: (p) => p.hargaJual.toLocaleString("id-ID")
        },
        { 
            header: 'STOK MINIMUM', 
            sortKey: 'stokMinimum', 
            className: 'text-center',
            renderCell: (p) => p.stokMinimal 
        },
        { 
            header: 'STATUS JUAL', 
            sortKey: 'status', 
            className: 'text-center',
            renderCell: (p) => p.status === 1 ? "Masih Dijual" : "Tidak Dijual"
        },
    ];

    return (
        <DataTable<TableItem>
            dataAwal={dataAwal as TableItem[]}
            columns={columns}
            searchKeys={['kode', 'nama']}
            filenameExport="Daftar_Item"
            excelMapping={(p, idx) => ({
                No: idx + 1,
                Kode: p.kode,
                Barcode: p.barcode, 
                NamaItem: p.nama, 
                Stok: p.stok, 
                Satuan: p.satuan,
                Rak: p.rak,
                Jenis: p.jenis,
                HargaBeli: p.hargaBeli,
                HargaJual: p.hargaJual,
                StokMinimum: p.stokMinimal,
                StatusJual: p.status === 1 ? "Masih Dijual" : "Tidak Dijual"
            })}
            pdfMapping={(p, idx) => [
                idx + 1, 
                String(p.kode), 
                p.barcode, 
                p.nama, 
                p.stok, 
                p.satuan,
                p.rak,
                p.jenis,
                p.hargaBeli,
                p.hargaJual,
                p.stokMinimal,
                p.status === 1 ? "Masih Dijual" : "Tidak Dijual"
            ]}
        />
    );
}
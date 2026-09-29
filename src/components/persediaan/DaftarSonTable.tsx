'use client';

import DataTable, { TableColumn } from "@/src/components/ui/DataTable";
import { SonService } from "@/src/features/persediaan/persediaan.service";
import { cn } from "@/src/lib/cn";
import { SessionPayload } from "@/src/types/auth";
import { SonListItem } from "@/src/types/son";
import { SquarePen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TableSonItem = SonListItem & Record<string, unknown>;

interface DaftarSonTableProps {
    initialData: SonListItem[];
    session: SessionPayload | null;
}

export default function DaftarSonTable({ initialData, session }: DaftarSonTableProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
    const isAdmin = session?.role === "Admin";
    const isKasir = session?.role === "Kasir";
    const canEdit = isAdmin || isKasir;

    const handleEdit = (row: TableSonItem) => {
        setLoadingEditId(row.sonNumber);
        // Sesuaikan route halaman edit SON sesuai project Anda
        router.push(`/inputSon?id=${encodeURIComponent(row.sonNumber)}`);
    };

    const handleDelete = async (sonNumber: string) => {
        const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus data SON ${sonNumber}?`);
        if (!confirmed) return;

        try {
            setIsDeleting(true);

            const res = await SonService.deleteSon(sonNumber);

            alert(res?.message || "Data SON berhasil dihapus.");

            router.refresh();
        } catch (error) {
            console.error("Gagal menghapus data SON:", error);
            alert("Terjadi kesalahan saat menghapus data.");
        } finally {
            setIsDeleting(false);
        }
    };

    const actionColumn: TableColumn<TableSonItem> = {
        header: 'ACTION',
        className: 'text-center',
        renderCell: (row) => (
            <div className="flex gap-1 items-center">
                <div className="tooltip" data-tip="Edit">
                    <button
                        className={cn("p-1.5 rounded cursor-pointer", "hover:bg-base-300")}
                        onClick={() => handleEdit(row)}
                        disabled={loadingEditId === row.sonNumber}
                    >
                        {loadingEditId === row.sonNumber ? (
                            <span className="loading loading-spinner loading-xs" />
                        ) : (
                            <SquarePen size={20} />
                        )}
                    </button>
                </div>
                <div className="tooltip" data-tip="Hapus">
                    <button
                        disabled={isDeleting}
                        className={cn("p-1.5 rounded cursor-pointer", "hover:bg-base-300")}
                        onClick={() => handleDelete(row.sonNumber)}
                    >
                        <Trash2 size={20} />
                    </button>
                </div>
            </div>
        )
    };

    const dataColumns: TableColumn<TableSonItem>[] = [
        {
            header: 'NO SON',
            sortKey: 'sonNumber',
            className: 'text-center min-w-[120px]',
            renderCell: (row) => row.sonNumber
        },
        {
            header: 'TANGGAL',
            sortKey: 'date',
            className: 'text-center min-w-[150px]',
            renderCell: (row) => row.date
        },
        {
            header: 'TOTAL ITEM',
            sortKey: 'totalItems',
            className: 'text-center',
            renderCell: (row) => row.totalItems
        },
        {
            header: 'DIBUAT OLEH',
            sortKey: 'createdBy',
            className: 'text-center',
            renderCell: (row) => row.createdBy || "-"
        },
    ];

    const columns: TableColumn<TableSonItem>[] = canEdit
        ? [actionColumn, ...dataColumns]
        : dataColumns;

    return (
        <DataTable<TableSonItem>
            dataAwal={initialData as TableSonItem[]}
            columns={columns}
            searchKeys={['sonNumber']}
            filenameExport="Daftar_SON"
            excelMapping={(row, idx) => ({
                No: idx + 1,
                NoSon: row.sonNumber,
                Tanggal: row.date,
                TotalItem: row.totalItems,
                DibuatOleh: row.createdBy || "-",
            })}
            pdfMapping={(row, idx) => [
                idx + 1,
                row.sonNumber,
                row.date,
                row.totalItems,
                row.createdBy || "-",
            ]}
        />
    );
}
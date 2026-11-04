'use client';

import DataTable, { TableColumn } from "@/src/components/ui/DataTable";
import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import { cn } from "@/src/lib/cn";
import { useKasirStore } from "@/src/store/useKasirStore";
import { SessionPayload } from "@/src/types/auth";
import { DaftarPenjualan, DataPelanggan } from "@/src/types/penjualan";
import { SquarePen, Trash2 } from "lucide-react";
import moment from "moment-timezone";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type TablePenjualan = DaftarPenjualan & Record<string, unknown>;

interface DaftarPenjualanTableProps {
    dataAwal: DaftarPenjualan[];
    session: SessionPayload | null;
    tglDari: string;
    tglSampai: string;
}

export default function DaftarPenjualanTable({ dataAwal, session, tglDari, tglSampai }: DaftarPenjualanTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.role === "Admin";
    const isKasir = session?.role === "Kasir";
    const canEdit = isAdmin || isKasir;
    const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
    const [inputDari, setInputDari] = useState(tglDari);
    const [inputSampai, setInputSampai] = useState(tglSampai);

    const terapkanPeriode = (dari: string, sampai: string) => {
        if (!dari || !sampai) return;
        router.push(`${pathname}?dari=${dari}&sampai=${sampai}`);
    };

    const handleEdit = (p: TablePenjualan) => {
        setLoadingEditId(p.idTransaksi);

        const dataPelanggan: DataPelanggan = {
            kodePelanggan: String(p.kdPelanggan),
            namaPelanggan: String(p.namaPelanggan),
            sumberPelanggan: String(p.sumber),
        };

        useKasirStore.getState().setEditContext(
            dataPelanggan,
            String(p.metode || ""),
            String(p.tanggal || "")
        );
        router.push(`/inputKasir?id=${p.idTransaksi}`);
    };

    const handleDelete = async (idTransaksi: string) => {
        const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus transaksi ${idTransaksi}?`);
        if (!confirmed) return;

        try {
            setIsDeleting(true);

            const res = await PenjualanService.deletePenjualan(idTransaksi);

            alert(res?.message || "Data transaksi berhasil dihapus.");

            router.refresh();

            // alert("Data transaksi berhasil dihapus.");
        } catch (error) {
            console.error("Gagal menghapus transaksi:", error);
            // alert("Terjadi kesalahan saat menghapus data.");
        } finally {
            setIsDeleting(false);
        }
    }

    const actionColumn: TableColumn<TablePenjualan> = {
        header: 'ACTION',
        className: 'text-center',
        renderCell: (p) => (
            <div className="flex gap-1 items-center">
                <div className="tooltip" data-tip="Edit">
                    <button
                        className={cn("p-1.5 rounded cursor-pointer", "hover:bg-base-300")}
                        onClick={() => handleEdit(p)}
                        disabled={loadingEditId === p.idTransaksi}
                    >
                        {loadingEditId === p.idTransaksi ? (
                            <span className="loading loading-spinner loading-xs" />
                        ) : (
                            <SquarePen size={20} />
                        )}
                    </button>
                </div>
                <div className="tooltip" data-tip="Hapus">
                    <button 
                        disabled={isDeleting}
                        className={cn(
                            "p-1.5 rounded cursor-pointer",
                            "hover:bg-base-300"
                        )}
                        onClick={() => handleDelete(p.idTransaksi)}
                    >
                        <Trash2 size={20}/>
                    </button> 
                </div>
            </div>
        )
    };
    
    const dataColumns: TableColumn<TablePenjualan>[] = [
        { 
            header: 'NO. TRANSAKSI', 
            sortKey: 'noTransaksi', 
            className: 'text-center',
            renderCell: (p) => p.idTransaksi 
        },
        { 
            header: 'TANGGAL', 
            sortKey: 'tanggal', 
            className: 'text-center',
            renderCell: (p) => moment(p.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
        },
        { 
            header: 'KODE PELANGGAN', 
            sortKey: 'kodePelanggan', 
            className: 'text-center',
            renderCell: (p) => p.kdPelanggan
        },
        { 
            header: 'NAMA PELANGGAN', 
            sortKey: 'namaPelanggan', 
            className: 'text-start',
            renderCell: (p) => p.namaPelanggan
        },
        { 
            header: 'TOTAL', 
            sortKey: 'total', 
            className: 'text-right',
            renderCell: (p) => p.total.toLocaleString("id-ID")
        },
        { 
            header: 'USER BUAT', 
            sortKey: 'userBuat', 
            className: 'text-center min-w-[200px]',
            renderCell: (p) => p.userBuat
        },
        { 
            header: 'USER UBAH', 
            sortKey: 'userUbah', 
            className: 'text-center min-w-[200px]',
            renderCell: (p) => p.userUbah
        },
    ];

    const columns: TableColumn<TablePenjualan>[] = canEdit
        ? [actionColumn, ...dataColumns]
        : dataColumns;

    return (
        <DataTable<TablePenjualan>
            dataAwal={dataAwal as TablePenjualan[]}
            columns={columns}
            searchKeys={['noTransaksi', 'namaPelanggan']}
            filenameExport="Daftar_Penjualan"
            toolbarExtra={
                <div className="flex flex-wrap items-center gap-2 text-xs max-sm:w-full">
                    <span className="max-sm:w-full">Periode</span>
                    <input
                        type="date"
                        className="input input-sm bg-base-200 border-0 sm:flex-1 md:min-w-[130px]"
                        value={inputDari}
                        max={inputSampai || undefined}
                        onChange={(e) => {
                            setInputDari(e.target.value);
                            terapkanPeriode(e.target.value, inputSampai);
                        }}
                    />
                    <span>s/d</span>
                    <input
                        type="date"
                        className="input input-sm bg-base-200 border-0 sm:flex-1 md:min-w-[130px]"
                        value={inputSampai}
                        min={inputDari || undefined}
                        onChange={(e) => {
                            setInputSampai(e.target.value);
                            terapkanPeriode(inputDari, e.target.value);
                        }}
                    />
                    <button
                        className="btn btn-sm btn-ghost max-sm:w-full"
                        onClick={() => router.push(pathname)}
                    >
                        Reset
                    </button>
                </div>
            }
            excelMapping={(p, idx) => ({
                No: idx + 1,
                NoTransaksi: p.idTransaksi,
                Tanggal: p.tanggal,
                KodePelanggan: p.kdPelanggan,
                NamaPelanggan: p.namaPelanggan,
                total: p.total,
                UserBuat: p.userBuat,
                UserUbah: p.userUbah
            })}
            pdfMapping={(p, idx) => [
                idx + 1, 
                String(p.idTransaksi), 
                p.tanggal, 
                p.kdPelanggan,
                p.namaPelanggan,
                p.total,
                p.userBuat,
                p.userUbah
            ]}
        />
    );
}
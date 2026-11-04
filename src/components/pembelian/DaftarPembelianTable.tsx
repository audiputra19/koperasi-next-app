'use client';

import DataTable, { TableColumn } from "@/src/components/ui/DataTable";
import { PembelianService } from "@/src/features/pembelian/pembelian.service";
import { cn } from "@/src/lib/cn";
import { usePembelianStore } from "@/src/store/usePembelianStore";
import { SessionPayload } from "@/src/types/auth";
import { DaftarPembelian, DataSupplier } from "@/src/types/pembelian";
import { SquarePen, Trash2 } from "lucide-react";
import moment from "moment-timezone";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";


type TablePembelian = DaftarPembelian & Record<string, unknown>;

interface DaftarPembelianTableProps {
    dataAwal: DaftarPembelian[];
    session: SessionPayload | null;
    tglDari: string;
    tglSampai: string;
}

export default function DaftarPembelianTable({ dataAwal, session, tglDari, tglSampai }: DaftarPembelianTableProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isDeleting, setIsDeleting] = useState(false);
    const isAdmin = session?.role === "Admin";
    const isKasir = session?.role === "Kasir";
    // const canEdit = isAdmin || isKasir;
    const canEdit = isAdmin;
    const [loadingEditId, setLoadingEditId] = useState<string | null>(null);
    const [inputDari, setInputDari] = useState(tglDari);
    const [inputSampai, setInputSampai] = useState(tglSampai);

    const terapkanPeriode = (dari: string, sampai: string) => {
        if (!dari || !sampai) return;
        router.push(`${pathname}?dari=${dari}&sampai=${sampai}`);
    };

    const handleEdit = (p: TablePembelian) => {
        setLoadingEditId(p.idTransaksi);

        const dataSupplier: DataSupplier = {
            kodeSupplier: String(p.kdSupplier),
            namaSupplier: String(p.namaSupplier),
        };

        usePembelianStore.getState().setEditContext(
            dataSupplier,
            String(p.metode || ""),
            String(p.tanggal || "")
        );

        router.push(`/inputPembelian?id=${p.idTransaksi}`);
    };

    const handleDelete = async (idTransaksi: string) => {
        const confirmed = window.confirm(`Apakah Anda yakin ingin menghapus transaksi ${idTransaksi}?`);
        if (!confirmed) return;

        try {
            setIsDeleting(true);

            const res = await PembelianService.deletePembelian(idTransaksi);

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

    const actionColumn: TableColumn<TablePembelian> = {
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
    
    const dataColumns: TableColumn<TablePembelian>[] = [
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
            header: 'KODE SUPPLIER', 
            sortKey: 'kodeSupplier', 
            className: 'text-center',
            renderCell: (p) => p.kdSupplier
        },
        { 
            header: 'NAMA SUPPLIER', 
            sortKey: 'namaSupplier', 
            className: 'text-start min-w-[250px]',
            renderCell: (p) => p.namaSupplier
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
            className: 'text-center',
            renderCell: (p) => p.userBuat
        },
        { 
            header: 'USER UBAH', 
            sortKey: 'userUbah', 
            className: 'text-center',
            renderCell: (p) => p.userUbah
        },
    ];

    const columns: TableColumn<TablePembelian>[] = canEdit
        ? [actionColumn, ...dataColumns]
        : dataColumns;

    return (
        <DataTable<TablePembelian>
            dataAwal={dataAwal as TablePembelian[]}
            columns={columns}
            searchKeys={['noTransaksi', 'namaSupplier']}
            filenameExport="Daftar_Pembelian"
                        toolbarExtra={
                <div className="flex flex-wrap items-center gap-2 text-xs">
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
                KodeSupplier: p.kdSupplier,
                NamaSupplier: p.namaSupplier,
                total: p.total,
                UserBuat: p.userBuat,
                UserUbah: p.userUbah
            })}
            pdfMapping={(p, idx) => [
                idx + 1, 
                String(p.idTransaksi), 
                p.tanggal, 
                p.kdSupplier,
                p.namaSupplier,
                p.total,
                p.userBuat,
                p.userUbah
            ]}
        />
    );
}
'use client';

import DataTable, { TableColumn } from "@/src/components/common/DataTable";
import { getDetailPenjualanAction } from "@/src/features/penjualan/action";
import { cn } from "@/src/lib/cn";
import { useKasirStore } from "@/src/store/useKasirStore";
import { DaftarPenjualan, DataKasir, DataPelanggan } from "@/src/types/penjualan";
import { SquarePen } from "lucide-react";
import moment from "moment-timezone";
import { useRouter } from "next/navigation";

type TablePenjualan = DaftarPenjualan & Record<string, unknown>;

interface DaftarPenjualanTableProps {
    dataAwal: DaftarPenjualan[];
}

export default function DaftarPenjualanTable({ dataAwal }: DaftarPenjualanTableProps) {
    const router = useRouter();
    const { setInitialDataForEdit } = useKasirStore();

    const handleEdit = async (p: TablePenjualan) => {
        
        try {
            const dataPelanggan: DataPelanggan = {
                kodePelanggan: String(p.kdPelanggan),
                namaPelanggan: String(p.namaPelanggan)
            };

            const responseDetail = await getDetailPenjualanAction(p.idTransaksi);
            console.log("Raw Response dari DB:", responseDetail);

            const dataBarang: DataKasir[] = responseDetail.map((detail) => ({
                kodeItem: detail.kodeItem,
                namaItem: detail.namaItem,
                jenis: detail.jenis || "",
                jumlah: Number(detail.jumlah || 0),
                satuan: detail.satuan || "",
                harga: Number(detail.harga || 0),
            }));

            setInitialDataForEdit(
                dataPelanggan,
                dataBarang,
                String(p.metode || ""), 
                String(p.tanggal || "")
            );
         
            router.push(`/inputKasir?id=${p.idTransaksi}`);
        } catch (error) {
            console.error("Gagal mengambil detail transaksi:", error);
            alert("Terjadi kesalahan saat memuat detail barang.");
        }
    };
    
    const columns: TableColumn<TablePenjualan>[] = [
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
            renderCell: (p) => moment(p.tanggal).format("YYYY-MM-DD HH:mm:ss")
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
            className: 'text-center',
            renderCell: (p) => p.namaPelanggan
        },
        { 
            header: 'TOTAL', 
            sortKey: 'total', 
            className: 'text-center',
            renderCell: (p) => p.total
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
        { 
            header: 'ACTION', 
            className: 'text-center',
            renderCell: (p) => (
                <button 
                    className={cn(
                        "p-1.5 rounded cursor-pointer",
                        "hover:bg-base-300"
                    )}
                    onClick={() => handleEdit(p)}
                >
                    <SquarePen size={20}/>
                </button> 
            )
        },
    ];

    return (
        <DataTable<TablePenjualan>
            dataAwal={dataAwal as TablePenjualan[]}
            columns={columns}
            searchKeys={['noTransaksi', 'namaPelanggan']}
            filenameExport="Daftar_Penjualan"
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
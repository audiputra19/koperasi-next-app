'use client';

import DataTable, { TableColumn } from "@/src/components/common/DataTable";
import { getDetailPembelianAction } from "@/src/features/pembelian/action";
import { cn } from "@/src/lib/cn";
import { usePembelianStore } from "@/src/store/usePembelianStore";
import { DaftarPembelian, DataPembelian, DataSupplier } from "@/src/types/pembelian";
import { SquarePen } from "lucide-react";
import moment from "moment-timezone";
import { useRouter } from "next/navigation";

type TablePembelian = DaftarPembelian & Record<string, unknown>;

interface DaftarPembelianTableProps {
    dataAwal: DaftarPembelian[];
}

export default function DaftarPembelianTable({ dataAwal }: DaftarPembelianTableProps) {
    const router = useRouter();
    const { setInitialDataForEdit } = usePembelianStore();

    const handleEdit = async (p: TablePembelian) => {
        
        try {
            const dataPelanggan: DataSupplier = {
                kodeSupplier: String(p.kdSupplier),
                namaSupplier: String(p.namaSupplier)
            };

            const responseDetail = await getDetailPembelianAction(p.idTransaksi);

            const dataBarang: DataPembelian[] = responseDetail.map((detail) => ({
                kodeItem: detail.kodeItem,
                namaItem: detail.namaItem,
                jenis: detail.jenis || "",
                jumlah: Number(detail.jumlah || 0),
                satuan: detail.satuan || "",
                harga: Number(detail.harga || 0),
                expireDate: moment(detail.expiredDate).format("YYYY-MM-DD")
            }));

            setInitialDataForEdit(
                dataPelanggan,
                dataBarang,
                String(p.metode || ""), 
                String(p.tanggal || "")
            );
            
            router.push(`/inputPembelian?id=${p.idTransaksi}`);
        } catch (error) {
            console.error("Gagal mengambil detail transaksi:", error);
            alert("Terjadi kesalahan saat memuat detail barang.");
        }
    };
    
    const columns: TableColumn<TablePembelian>[] = [
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
            header: 'KODE SUPPLIER', 
            sortKey: 'kodeSupplier', 
            className: 'text-center',
            renderCell: (p) => p.kdSupplier
        },
        { 
            header: 'NAMA SUPPLIER', 
            sortKey: 'namaSupplier', 
            className: 'text-center',
            renderCell: (p) => p.namaSupplier
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
        <DataTable<TablePembelian>
            dataAwal={dataAwal as TablePembelian[]}
            columns={columns}
            searchKeys={['noTransaksi', 'namaSupplier']}
            filenameExport="Daftar_Pembelian"
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
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { Autocomplete } from "@/src/components/common/AutoComplete";
import { useLaporanStore } from "@/src/store/useLaporanStore";
import { DaftarPelanggan } from "@/src/types/menu";
import { Printer } from "lucide-react";

interface DaftarLaporanClientProps {
    dataPelanggan: DaftarPelanggan[];
}

export default function DaftarLaporanClient({ dataPelanggan }: DaftarLaporanClientProps) {
    const router = useRouter();
    const { 
        startDate, 
        endDate, 
        listPelanggan, 
        setStartDate, 
        setEndDate, 
        setListPelanggan,
    } = useLaporanStore();

    useEffect(() => {
        if (!startDate) {
            const tgl1 = moment().tz("Asia/Jakarta").startOf("month").format("YYYY-MM-DD");
            setStartDate(tgl1);
        }
        if (!endDate) {
            const tglHariIni = moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
            setEndDate(tglHariIni);
        }
    }, [startDate, endDate, setStartDate, setEndDate]);

    const handleNavigasi = (path: string, autoPrint: boolean) => {
        if (!startDate || !endDate) {
            alert("Silakan pilih periode tanggal terlebih dahulu!");
            return;
        }
        const url = autoPrint ? `${path}?autoPrint=true` : path;
        router.push(url);
    };
     
    return (
        <div className="w-full max-w-5xl bg-base-100 border border-base-300 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-5">Laporan Penjualan</h2>
            
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-1">
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Periode Awal
                        </label>
                        <input 
                            type="date" 
                            className="input border border-base-300 w-full text-gray-700 focus:input-primary h-11" 
                            value={startDate || ""} 
                            onChange={(e) => setStartDate(e.target.value)} 
                        />
                    </div>
                    
                    <div className="hidden sm:block pb-3 font-medium text-gray-400">-</div>
                    
                    <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Periode Akhir
                        </label>
                        <input 
                            type="date" 
                            className="input border border-base-300 w-full text-gray-700 focus:input-primary h-11" 
                            value={endDate || ""} 
                            onChange={(e) => setEndDate(e.target.value)} 
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Filter Pelanggan
                        </label>
                        <Autocomplete 
                            options={dataPelanggan}
                            placeholder="Semua Pelanggan"
                            selectedValue={listPelanggan?.namaPelanggan || ""}
                            valueKey="kode"
                            labelKey="nama"
                            onSelect={(pelanggan) => {
                                setListPelanggan({
                                    kodePelanggan: pelanggan.kode,
                                    namaPelanggan: pelanggan.nama
                                });
                            }}
                            onClear={() => setListPelanggan({ kodePelanggan: "", namaPelanggan: "" })}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap gap-3 pt-4 lg:pt-0 border-t border-gray-100 lg:border-t-0 justify-end">
                    <div className="flex rounded-lg overflow-hidden border border-base-300">
                        <button
                            type="button"
                            onClick={() => handleNavigasi("/laporanPenjualanDetail", false)}
                            className="btn btn-ghost bg-base-100 hover:bg-primary/10 text-indigo-700 rounded-none border-none h-11 min-h-0 normal-case px-4 font-medium"
                        >
                            Lihat Detail
                        </button>
                        <button
                            type="button"
                            onClick={() => handleNavigasi("/laporanPenjualanDetail", true)}
                            className="btn btn-primary bg-primary hover:bg-primary/70 text-white rounded-none border-none h-11 min-h-0 px-3"
                            title="Cetak Laporan Detail"
                        >
                            <Printer size={16} />
                        </button>
                    </div>

                    <div className="flex rounded-lg overflow-hidden border border-base-300">
                        <button
                            type="button"
                            onClick={() => handleNavigasi("/laporanPenjualanRekap", false)}
                            className="btn btn-ghost bg-base-100 hover:bg-emerald-700/10 text-emerald-700 rounded-none border-none h-11 min-h-0 normal-case px-4 font-medium"
                        >
                            Lihat Rekap
                        </button>
                        <button
                            type="button"
                            onClick={() => handleNavigasi("/laporanPenjualanRekap", true)}
                            className="btn btn-success bg-emerald-600 hover:bg-emerald-600/70 text-white rounded-none border-none h-11 min-h-0 px-3"
                            title="Cetak Laporan Rekap"
                        >
                            <Printer size={16} />
                        </button>
                    </div>
                </div>
            </div> 
        </div>
    );
}
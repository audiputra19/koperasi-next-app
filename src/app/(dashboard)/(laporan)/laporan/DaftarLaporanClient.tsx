"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import moment from "moment-timezone";
import { useLaporanStore } from "@/src/store/useLaporanStore";
import { DaftarPelanggan } from "@/src/types/menu";
import { Loader2, Printer, SheetIcon } from "lucide-react";
import { Autocomplete } from "@/src/components/ui/AutoComplete";
// import { exportRugiLabaExcel } from "@/src/features/laporan/excel/rugiLabaExcel";
import { exportRekapExcel } from "@/src/features/laporan/excel/rekapExcel";
import { SessionPayload } from "@/src/types/auth";

interface DaftarLaporanClientProps {
    dataPelanggan: DaftarPelanggan[];
    session: SessionPayload | null;
}

export default function DaftarLaporanClient({ dataPelanggan, session }: DaftarLaporanClientProps) {
    const router = useRouter();
    // const [exportingRugiLaba, setExportingRugiLaba] = useState(false);
    const [exportingRekap, setExportingRekap] = useState(false);
    const { 
        startDate, 
        endDate, 
        listPelanggan, 
        setStartDate, 
        setEndDate, 
        setListPelanggan,
    } = useLaporanStore();

    const isAnggota = session?.role === "Anggota";
    const isKasir = session?.role === "Kasir";
    const isPengawas = session?.role === "Pengawas";

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

    useEffect(() => {
        if((isAnggota || isKasir) && session.userId) {
            setListPelanggan({
                kodePelanggan: session.userId,
                namaPelanggan: session.nama
            })
        }
    }, []);

    const handleNavigasi = (path: string, autoPrint: boolean) => {
        if (!startDate || !endDate) {
            alert("Silakan pilih periode tanggal terlebih dahulu!");
            return;
        }

        const query = new URLSearchParams();
        query.set("startDate", startDate);
        query.set("endDate", endDate);
        if (listPelanggan?.kodePelanggan) {
            query.set("kdPelanggan", listPelanggan.kodePelanggan);
        }
        if (autoPrint) {
            query.set("autoPrint", "true");
        }

        router.push(`${path}?${query.toString()}`);
    };

    // const handleExportRugiLabaExcel = async () => {
    //     if (!startDate || !endDate) {
    //         alert("Silakan pilih periode tanggal terlebih dahulu!");
    //         return;
    //     }
    //     try {
    //         setExportingRugiLaba(true);
    //         const result = await exportRugiLabaExcel(startDate, endDate, listPelanggan?.kodePelanggan);
    //         if (!result.success) alert(result.message);
    //     } catch (error) {
    //         console.error(error);
    //         alert("Gagal membuat file Excel. Silakan coba lagi.");
    //     } finally {
    //         setExportingRugiLaba(false);
    //     }
    // };

    const handleExportRekapExcel = async () => {
        if (!startDate || !endDate) {
            alert("Silakan pilih periode tanggal terlebih dahulu!");
            return;
        }
        try {
            setExportingRekap(true);
            const result = await exportRekapExcel(startDate, endDate, listPelanggan?.kodePelanggan);
            if (!result.success) alert(result.message);
        } catch (error) {
            console.error(error);
            alert("Gagal membuat file Excel. Silakan coba lagi.");
        } finally {
            setExportingRekap(false);
        }
    };
     
    return (
        <div className="w-full max-w-5xl bg-base-100 border border-base-300 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-5">Laporan Penjualan</h2>
            <div className="flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-1">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Periode Awal
                            </label>
                            <input 
                                type="date" 
                                className="input border border-base-300 text-gray-500 w-full focus:input-primary h-11" 
                                value={startDate || ""} 
                                onChange={(e) => setStartDate(e.target.value)} 
                            />
                        </div>
                        
                        <div className="hidden sm:block pb-3 font-medium text-gray-400">-</div>
                        
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Periode Akhir
                            </label>
                            <input 
                                type="date" 
                                className="input border border-base-300 text-gray-500 w-full focus:input-primary h-11" 
                                value={endDate || ""} 
                                onChange={(e) => setEndDate(e.target.value)} 
                            />
                        </div>
                        {(!isAnggota && !isKasir) && (
                            <div className="flex flex-col gap-1.5 flex-1 lg:max-w-[400px]">
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
                        )}
                    </div>
                </div> 
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between rounded-lg overflow-hidden border border-base-300">
                        <button
                            type="button"
                            onClick={() => handleNavigasi("/laporanPenjualanDetail", false)}
                            className="flex-1 justify-start btn btn-ghost bg-base-100 hover:bg-primary/10 text-primary rounded-none border-none h-11 min-h-0 normal-case px-4 font-medium"
                        >
                            Laporan Penjualan Detail
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

                    <div className="flex justify-between rounded-lg overflow-hidden border border-base-300">
                        <button
                            type="button"
                            onClick={() => handleNavigasi("/laporanPenjualanRekap", false)}
                            className="flex-1 justify-start btn btn-ghost bg-base-100 hover:bg-primary/10 text-primary rounded-none border-none h-11 min-h-0 normal-case px-4 font-medium"
                        >
                            Laporan Penjualan Rekap
                        </button>
                        <div>
                            <button
                                type="button"
                                onClick={() => handleNavigasi("/laporanPenjualanRekap", true)}
                                className="btn btn-primary bg-primary hover:bg-primary/70 text-white rounded-none border-none h-11 min-h-0 px-3"
                                title="Cetak Laporan Rekap"
                            >
                                <Printer size={16} />
                            </button>
                            <button
                                type="button"
                                onClick={handleExportRekapExcel}
                                className="btn btn-primary bg-emerald-600 hover:bg-emerald-500 text-white rounded-none border-none h-11 min-h-0 px-3"
                                title="Excel Laporan Rugi Laba"
                            >
                                {exportingRekap ? <Loader2 size={16} className="animate-spin" /> : <SheetIcon size={16} />}
                            </button>
                        </div>
                    </div>
                    {(!isAnggota && !isKasir) && (
                        <div className="flex justify-between rounded-lg overflow-hidden border border-base-300">
                            <button
                                type="button"
                                onClick={() => handleNavigasi("/laporanRugiLaba", false)}
                                className="flex-1 justify-start btn btn-ghost bg-base-100 hover:bg-primary/10 text-primary rounded-none border-none h-11 min-h-0 normal-case px-4 font-medium"
                            >
                                Laporan Rugi Laba
                            </button>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => handleNavigasi("/laporanRugiLaba", true)}
                                    className="btn btn-primary bg-primary hover:bg-primary/70 text-white rounded-none border-none h-11 min-h-0 px-3"
                                    title="Cetak Laporan Rugi Laba"
                                >
                                    <Printer size={16} />
                                </button>
                                {/* <button
                                    type="button"
                                    onClick={handleExportRugiLabaExcel}
                                    disabled={exportingRugiLaba}
                                    className="btn btn-primary bg-emerald-600 hover:bg-emerald-500 text-white rounded-none border-none h-11 min-h-0 px-3"
                                    title="Excel Laporan Rugi Laba"
                                >
                                    {exportingRugiLaba ? <Loader2 size={16} className="animate-spin" /> : <SheetIcon size={16} />}
                                </button> */}
                            </div>
                        </div>
                    )}

                    {!isAnggota && (
                        <div className="flex justify-between rounded-lg overflow-hidden border border-base-300">
                            <button
                                type="button"
                                onClick={() => handleNavigasi("/laporanKasir", false)}
                                className="flex-1 justify-start btn btn-ghost bg-base-100 hover:bg-primary/10 text-primary rounded-none border-none h-11 min-h-0 normal-case px-4 font-medium"
                            >
                                Laporan Kasir 
                            </button>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => handleNavigasi("/laporanKasir", true)}
                                    className="btn btn-primary bg-primary hover:bg-primary/70 text-white rounded-none border-none h-11 min-h-0 px-3"
                                    title="Cetak Laporan Kasir"
                                >
                                    <Printer size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
"use client";

import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logo from '@/public/images/koperasi-logo.jpg';
import { useLaporanStore } from "@/src/store/useLaporanStore";
import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import { LaporanService } from "@/src/features/laporan/laporan.service";
import { DataLaporan } from "@/src/types/laporan";
import { DaftarPenjualanDetail } from "@/src/types/penjualan";
import Image from "next/image";

export default function LaporanPenjualanRekapClient() {
    const searchParams = useSearchParams();
    const autoPrint = searchParams.get("autoPrint");
    
    const { startDate: storeStartDate, endDate: storeEndDate, listPelanggan } = useLaporanStore();
    
    const formatDate1 = storeStartDate || moment().tz("Asia/Jakarta").startOf("month").format("YYYY-MM-DD");
    const formatDate2 = storeEndDate || moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    
    const kdPelanggan = listPelanggan?.kodePelanggan || undefined;

    const date1 = moment(formatDate1).tz("Asia/Jakarta").format("DD/MM/YYYY");
    const date2 = moment(formatDate2).tz("Asia/Jakarta").format("DD/MM/YYYY");
    
    const router = useRouter();

    const [dataLaporan, setDataLaporan] = useState<DataLaporan[] | null>(null);
    const [kasirDetails, setKasirDetails] = useState<Record<string, DaftarPenjualanDetail[]>>({});
    
    const [kasirLoading, setKasirLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(true);

    useEffect(() => {
        const fetchLaporan = async () => {
            try {
                setKasirLoading(true);
                const res = await LaporanService.getLaporan(formatDate1, formatDate2, kdPelanggan);
                setDataLaporan(res);
            } catch (error) {
                console.error("Gagal fetch laporan:", error);
                setKasirLoading(false);
            }
        };

        fetchLaporan();
    }, [formatDate1, formatDate2, kdPelanggan]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!dataLaporan || dataLaporan.length === 0) {
                setLoadingDetail(false);
                setKasirLoading(false);
                return;
            }

            setLoadingDetail(true);
            const details: Record<string, DaftarPenjualanDetail[]> = {};
            
            for (const item of dataLaporan) {
                try {
                    const result = await PenjualanService.getDaftarPenjualanDetail(item.idTransaksi);
                    details[item.idTransaksi] = result;
                } catch (error) {
                    console.error(`Gagal fetch detail untuk ${item.idTransaksi}`, error);
                }
            }
            setKasirDetails(details);
            setLoadingDetail(false);
            setKasirLoading(false);
        };

        fetchDetails();
    }, [dataLaporan]);

    useEffect(() => {
        const fileName = `laporan_penjualan_rekap_${moment(date1, "DD/MM/YYYY").tz("Asia/Jakarta").format("YYYYMMDD")}_${moment(date2, "DD/MM/YYYY").tz("Asia/Jakarta").format("YYYYMMDD")}`;
        const prevTitle = document.title;
        document.title = fileName;
        
        if (autoPrint === "true" && !kasirLoading && !loadingDetail) {
            const handleAfterPrint = () => {
                document.title = prevTitle;
                router.back();
            };

            window.addEventListener("afterprint", handleAfterPrint);

            const timeout = setTimeout(() => {
                window.print();
            }, 500);

            return () => {
                clearTimeout(timeout);
                window.removeEventListener("afterprint", handleAfterPrint);
                document.title = prevTitle;
            };
        }
    }, [autoPrint, kasirLoading, loadingDetail, date1, date2, router]);

    const totalItem = dataLaporan?.reduce((total, item) => {
        const detail = kasirDetails[item.idTransaksi];
        return total + (detail?.length || 0);
    }, 0) || 0;

    const totalAkhir = dataLaporan?.reduce((total, item) => {
        return total + item.total; 
    }, 0) || 0;

    const totalMetode = dataLaporan?.reduce((acc, item) => {
        if (item.metode === 1) acc.tunai += item.total;
        if (item.metode === 2) acc.kredit += item.total;
        if (item.metode === 3) acc.qris += item.total;
        return acc;
    }, {tunai: 0, kredit: 0, qris: 0}) || {tunai: 0, kredit: 0, qris: 0};

    return (
        <div className="text-black bg-white w-full">
            <div className="border border-dashed bg-white text-black min-w-max md:min-w-0 print:min-w-full print:border-none">
                <div className="flex justify-between p-5 gap-4">
                    <div className="flex gap-3">
                        <Image 
                            src={logo}
                            alt="Login Image"
                            width={110}
                            className="z-999"
                            priority
                        />
                        <div className="w-[250px]">
                            <p className="font-bold">LAPORAN PENJUALAN REKAP</p>
                            <p className="text-sm font-semibold">KOPERASI KONSUMEN KARYAWAN SARANDI KARYA NUGRAHA</p>
                            <p className="text-xs">KOMPLEK SENTRIS BLOK E NO 8</p>
                            <p className="text-xs">0266-218444</p>
                            <p className="text-xs">0266-218555</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs whitespace-nowrap">PERIODE: {date1} - {date2}</p>
                    </div>
                </div>

                <div className="p-5 overflow-x-auto w-full print:p-0 print:overflow-visible">
                    <table className="w-full border-collapse min-w-[800px] print:min-w-full print:table-fixed">
                        <thead className="border-t">
                            <tr className="text-sm text-black">
                                <th className="px-1 py-1 text-center print:w-[18%]">No Transaksi</th>
                                <th className="px-1 py-1 text-center print:w-[18%]">Tanggal</th>
                                <th className="px-1 py-1 text-center print:w-[10%]">NIK</th>
                                <th className="px-1 py-1 text-center print:w-[30%]">Nama</th>
                                <th className="px-1 py-1 text-center print:w-[8%]">Jml Item</th>
                                <th className="px-1 py-1 text-right print:w-[12%]">Total</th>
                                <th className="px-1 py-1 text-right print:w-[11%]">Tunai</th>
                                <th className="px-1 py-1 text-right print:w-[11%]">Kredit</th>
                                <th className="px-1 py-1 text-right print:w-[11%]">QRIS</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td colSpan={12} className="h-2">
                                    <div className="border-t"></div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={12}>
                                    <div className="border-t"></div>
                                </td>
                            </tr>
                            {dataLaporan?.map(item => {
                                const detail = kasirDetails[item.idTransaksi];
                                const jumlahItem = detail?.length;
                                let tunai = 0;
                                let kredit = 0;
                                let qris = 0;
                                if(item.metode === 1) {
                                    tunai = item.total;
                                } else if(item.metode === 2) {
                                    kredit = item.total;
                                } else if(item.metode === 3) {
                                    qris = item.total;
                                }

                                const tanggal = moment(item.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

                                return (
                                    <tr 
                                        className="text-xs text-black print:break-inside-avoid"
                                        key={item.idTransaksi}
                                    >
                                        <td className="text-center px-1 py-1 break-all">{item.idTransaksi}</td>
                                        <td className="text-center px-1 py-1 text-[10px] md:text-xs">{tanggal}</td>
                                        <td className="text-center px-1 py-1 truncate">{item.kdPelanggan}</td>
                                        <td className="text-start px-1 py-1 truncate">{item.namaPelanggan}</td>
                                        <td className="text-center px-1 py-1">{jumlahItem}</td>
                                        <td className="text-right px-1 py-1">{item.total.toLocaleString("id-ID")}</td>
                                        <td className="text-right px-1 py-1">{tunai.toLocaleString("id-ID")}</td>
                                        <td className="text-right px-1 py-1">{kredit.toLocaleString("id-ID")}</td>
                                        <td className="text-right px-1 py-1">{qris.toLocaleString("id-ID")}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="text-xs">
                                <th colSpan={4} className="text-right">Total</th>
                                <th className="text-center px-2 py-1">{totalItem.toLocaleString("id-ID")}</th>
                                <th className="text-right px-2 py-1">{totalAkhir.toLocaleString("id-ID")}</th>
                                <th className="text-right px-2 py-1">{totalMetode.tunai.toLocaleString("id-ID")}</th>
                                <th className="text-right px-2 py-1">{totalMetode.kredit.toLocaleString("id-ID")}</th>
                                <th className="text-right px-2 py-1">{totalMetode.qris.toLocaleString("id-ID")}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
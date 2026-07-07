"use client";

import moment from "moment-timezone";
import { Fragment, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import logo from '@/public/images/koperasi-logo.jpg';
import { useLaporanStore } from "@/src/store/useLaporanStore";
import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import { LaporanService } from "@/src/features/laporan/laporan.service";
import { DataLaporan } from "@/src/types/laporan";
import { DaftarPenjualanDetail } from "@/src/types/penjualan";
import Image from "next/image";

export default function LaporanPenjualanDetailClient() {
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

    return (
        <div className="text-black bg-white w-full">
            <div className="border border-dashed border-gray-800 bg-white text-black min-w-max md:min-w-0">
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
                            <p className="font-bold">LAPORAN PENJUALAN Detail</p>
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

                <div className="p-5 overflow-x-auto w-full">
                    <table className="w-full border-collapse min-w-[600px]">
                        <thead className="border-t">
                            <tr className="text-sm text-black">
                                <th className="px-2">No Transaksi</th>
                                <th className="px-2">Tanggal</th>
                                <th className="px-2">NIK</th>
                                <th className="px-2">Nama</th>
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
                                let totalJml = 0;
                                let totalAll = 0;

                                const tanggal = moment(item.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

                                return (
                                    <Fragment key={item.idTransaksi}>
                                        <tr className="text-xs text-black">
                                            <td className="text-center px-2 py-1">{item.idTransaksi}</td>
                                            <td className="text-center px-2 py-1">{tanggal}</td>
                                            <td className="text-center px-2 py-1">{item.kdPelanggan}</td>
                                            <td className="text-start px-2 py-1">{item.namaPelanggan}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={6} className="py-3">
                                                <div className="p-2 border border-dashed bg-gray-50 overflow-x-auto">
                                                    <table className="w-full min-w-[550px]">
                                                        <thead>
                                                            <tr className="text-xs text-black">
                                                                <th className="px-2 text-center">No</th>
                                                                <th className="px-2 text-center">Kd Item</th>
                                                                <th className="px-2 text-center">Nama Item</th>
                                                                <th className="px-2 text-center">Jml</th>
                                                                <th className="px-2 text-center">Harga</th>
                                                                <th className="px-2 text-center">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {detail?.map((itemDetail, index) => {
                                                                const total = itemDetail.harga * itemDetail.jumlah;
                                                                totalJml += itemDetail.jumlah;
                                                                totalAll += total;

                                                                return (
                                                                    <tr className="text-xs" key={itemDetail.kodeItem}>
                                                                        <td className="text-center px-2 py-1 w-[20px]">{index + 1}</td>
                                                                        <td className="text-center px-2 py-1 w-[50px]">{itemDetail.kodeItem}</td>
                                                                        <td className="text-left px-2 py-1 w-[100px]">{itemDetail.namaItem}</td>
                                                                        <td className="text-center px-2 py-1 w-[50px]">{itemDetail.jumlah.toLocaleString("id-ID")}</td>
                                                                        <td className="text-center px-2 py-1 w-[50px]">{(itemDetail.harga ?? 0).toLocaleString("id-ID")}</td>
                                                                        <td className="text-center px-2 py-1 w-[50px]">{total.toLocaleString("id-ID")}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                        <tfoot>
                                                            <tr className="text-xs">
                                                                <th colSpan={3} className="text-right px-2 py-1">Total</th>
                                                                <th className="text-center px-2 py-1 border-t border-dashed">{totalJml.toLocaleString("id-ID")}</th>
                                                                <th className="border-t border-dashed"></th>
                                                                <th className="text-center px-2 py-1 border-t border-dashed">{totalAll.toLocaleString("id-ID")}</th>
                                                            </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
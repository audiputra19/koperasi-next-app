"use client";

import moment from "moment-timezone";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from '@/public/images/koperasi-logo.jpg';
import { DataLaporan } from "@/src/types/laporan";
import { DaftarPenjualanDetail } from "@/src/types/penjualan";
import Image from "next/image";

interface Props {
    dataLaporan: DataLaporan[];
    kasirDetails: Record<string, DaftarPenjualanDetail[]>;
    startDate: string;
    endDate: string;
    autoPrint?: string;
}

export default function LaporanPenjualanDetailClient({
    dataLaporan,
    kasirDetails,
    startDate,
    endDate,
    autoPrint,
}: Props) {
    const router = useRouter();

    const date1 = moment(startDate).tz("Asia/Jakarta").format("DD/MM/YYYY");
    const date2 = moment(endDate).tz("Asia/Jakarta").format("DD/MM/YYYY");

    const { grandTotalJml, grandTotalAll } = dataLaporan?.reduce(
        (acc, item) => {
            const detail = kasirDetails[item.idTransaksi] || [];
            detail.forEach((itemDetail) => {
                acc.grandTotalJml += itemDetail.jumlah;
                acc.grandTotalAll += itemDetail.harga * itemDetail.jumlah;
            });
            return acc;
        },
        { grandTotalJml: 0, grandTotalAll: 0 }
    ) ?? { grandTotalJml: 0, grandTotalAll: 0 };

    useEffect(() => {
        const fileName = `laporan_penjualan_rekap_${moment(date1, "DD/MM/YYYY").tz("Asia/Jakarta").format("YYYYMMDD")}_${moment(date2, "DD/MM/YYYY").tz("Asia/Jakarta").format("YYYYMMDD")}`;
        const prevTitle = document.title;
        document.title = fileName;

        if (autoPrint === "true") {
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
    }, [autoPrint, date1, date2, router]);

    return (
        <div className="text-black bg-white w-full">
            <style jsx global>{`
                @media print {
                    thead {
                        display: table-header-group;
                    }
                    tfoot {
                        display: table-footer-group;
                    }
                    tbody.transaksi-group {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                }
            `}</style>

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
                            <p className="font-bold">LAPORAN PENJUALAN DETAIL</p>
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
                        </tbody>
                        {dataLaporan?.map(item => {
                            const detail = kasirDetails[item.idTransaksi];
                            let totalJml = 0;
                            let totalAll = 0;

                            const tanggal = moment(item.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

                            return (
                                <tbody key={item.idTransaksi} className="transaksi-group">
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
                                                            <th className="px-2 text-center w-[40px]">No</th>
                                                            <th className="px-2 text-center w-[100px]">Kd Item</th>
                                                            <th className="px-2 text-center w-[200px]">Nama Item</th>
                                                            <th className="px-2 text-center w-[70px]">Jml</th>
                                                            <th className="px-2 text-center w-[100px]">Harga</th>
                                                            <th className="px-2 text-center w-[100px]">Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detail?.map((itemDetail, index) => {
                                                            const total = itemDetail.harga * itemDetail.jumlah;
                                                            totalJml += itemDetail.jumlah;
                                                            totalAll += total;

                                                            return (
                                                                <tr className="text-xs" key={itemDetail.kodeItem}>
                                                                    <td className="text-center px-2 py-1 truncate">{index + 1}</td>
                                                                    <td className="text-center px-2 py-1 truncate">{itemDetail.kodeItem}</td>
                                                                    <td className="text-left px-2 py-1 break-words">{itemDetail.namaItem}</td>
                                                                    <td className="text-center px-2 py-1">{itemDetail.jumlah.toLocaleString("id-ID")}</td>
                                                                    <td className="text-center px-2 py-1">{(itemDetail.harga ?? 0).toLocaleString("id-ID")}</td>
                                                                    <td className="text-center px-2 py-1">{total.toLocaleString("id-ID")}</td>
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
                                </tbody>
                            );
                        })}
                        <tfoot className="border-t border-b">
                            <tr className="text-sm text-black font-semibold">
                                <td colSpan={4} className="text-right px-2 py-2">
                                    Total Keseluruhan
                                </td>
                                <td className="text-center px-2 py-2">
                                    Rp. {grandTotalAll.toLocaleString("id-ID")}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
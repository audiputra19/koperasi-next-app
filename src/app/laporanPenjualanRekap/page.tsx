import moment from "moment-timezone";
import { LaporanService } from "@/src/features/laporan/laporan.service";
import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import LaporanPenjualanRekapClient from "./LaporanPenjualanRekapClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LaporanPenjualanRekap({ searchParams }: PageProps) {
    const params = await searchParams;

    const startDate =
        (params.startDate as string) ||
        moment().tz("Asia/Jakarta").startOf("month").format("YYYY-MM-DD");
    const endDate =
        (params.endDate as string) ||
        moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const kdPelanggan = (params.kdPelanggan as string) || undefined;
    const autoPrint = (params.autoPrint as string) || undefined;

    const dataLaporan = await LaporanService.getLaporan(startDate, endDate, kdPelanggan);

    const detailEntries = await Promise.all(
        (dataLaporan || []).map(async (item) => {
            try {
                const result = await PenjualanService.getDaftarPenjualanDetail(item.idTransaksi);
                return [item.idTransaksi, result] as const;
            } catch (error) {
                console.error(`Gagal fetch detail untuk ${item.idTransaksi}`, error);
                return [item.idTransaksi, []] as const;
            }
        })
    );
    const kasirDetails = Object.fromEntries(detailEntries);

    return (
        <main className="p-5 w-full flex justify-center">
            <LaporanPenjualanRekapClient
                dataLaporan={dataLaporan}
                kasirDetails={kasirDetails}
                startDate={startDate}
                endDate={endDate}
                autoPrint={autoPrint}
            />
        </main>
    );
}
import moment from "moment-timezone";
import { LaporanPembelianService, LaporanService } from "@/src/features/laporan/laporan.service";
import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import { PembelianService } from "@/src/features/pembelian/pembelian.service";
import LaporanKasirClient from "./LaporanKasirClient";

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LaporanKasir({ searchParams }: PageProps) {
    const params = await searchParams;

    const startDate =
        (params.startDate as string) ||
        moment().tz("Asia/Jakarta").startOf("month").format("YYYY-MM-DD");
    const endDate =
        (params.endDate as string) ||
        moment().tz("Asia/Jakarta").format("YYYY-MM-DD");
    const kdPelanggan = (params.kdPelanggan as string) || undefined;
    const autoPrint = (params.autoPrint as string) || undefined;

    // Fetch kedua laporan induk secara paralel
    const [dataLaporan, dataLaporanPembelian] = await Promise.all([
        LaporanService.getLaporan(startDate, endDate, kdPelanggan),
        LaporanPembelianService.getLaporan(startDate, endDate),
    ]);

    // Fetch detail penjualan & pembelian paralel juga
    const [kasirDetailEntries, pembelianDetailEntries] = await Promise.all([
        Promise.all(
            (dataLaporan || []).map(async (item) => {
                try {
                    const result = await PenjualanService.getDaftarPenjualanDetail(item.idTransaksi);
                    return [item.idTransaksi, result] as const;
                } catch (error) {
                    console.error(`Gagal fetch detail untuk ${item.idTransaksi}`, error);
                    return [item.idTransaksi, []] as const;
                }
            })
        ),
        Promise.all(
            (dataLaporanPembelian || []).map(async (item) => {
                try {
                    const result = await PembelianService.getDaftarPembelianDetail(item.idTransaksi);
                    return [item.idTransaksi, result] as const;
                } catch (error) {
                    console.error(`Gagal fetch detail untuk ${item.idTransaksi}`, error);
                    return [item.idTransaksi, []] as const;
                }
            })
        ),
    ]);

    const kasirDetails = Object.fromEntries(kasirDetailEntries);
    const pembelianDetails = Object.fromEntries(pembelianDetailEntries);

    return (
        <main className="p-5 w-full flex justify-center">
            <LaporanKasirClient
                dataLaporan={dataLaporan}
                dataLaporanPembelian={dataLaporanPembelian}
                kasirDetails={kasirDetails}
                pembelianDetails={pembelianDetails}
                startDate={startDate}
                endDate={endDate}
                autoPrint={autoPrint}
            />
        </main>
    );
}
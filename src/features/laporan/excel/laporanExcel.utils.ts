import moment from "moment-timezone";
import { LaporanService } from "@/src/features/laporan/laporan.service";
import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import { DataLaporan } from "@/src/types/laporan";
import { DaftarPenjualanDetail } from "@/src/types/penjualan";

export interface LaporanExcelData {
    dataLaporan: DataLaporan[];
    kasirDetails: Record<string, DaftarPenjualanDetail[]>;
    date1: string;
    date2: string;
}

export async function fetchLaporanExcelData(
    startDate: string,
    endDate: string,
    kdPelanggan?: string
): Promise<LaporanExcelData | null> {
    const dataLaporan = await LaporanService.getLaporan(startDate, endDate, kdPelanggan);

    if (!dataLaporan || dataLaporan.length === 0) {
        return null;
    }

    const kasirDetails: Record<string, DaftarPenjualanDetail[]> = {};
    for (const item of dataLaporan) {
        try {
            kasirDetails[item.idTransaksi] = await PenjualanService.getDaftarPenjualanDetail(item.idTransaksi);
        } catch (error) {
            console.error(`Gagal fetch detail untuk ${item.idTransaksi}`, error);
            kasirDetails[item.idTransaksi] = [];
        }
    }

    const date1 = moment(startDate).tz("Asia/Jakarta").format("DD/MM/YYYY");
    const date2 = moment(endDate).tz("Asia/Jakarta").format("DD/MM/YYYY");

    return { dataLaporan, kasirDetails, date1, date2 };
}

export const KOP_HEADER = [
    ["LAPORAN"],
    ["KOPERASI KONSUMEN KARYAWAN SARANDI KARYA NUGRAHA"],
    ["KOMPLEK SENTRIS BLOK E NO 8"],
];
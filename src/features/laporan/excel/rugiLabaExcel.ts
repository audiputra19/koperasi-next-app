import * as XLSX from "xlsx";
import moment from "moment-timezone";
import { fetchLaporanExcelData } from "./laporanExcel.utils";

export async function exportRugiLabaExcel(
    startDate: string,
    endDate: string,
    kdPelanggan?: string
) {
    const data = await fetchLaporanExcelData(startDate, endDate, kdPelanggan);
    if (!data) {
        return { success: false, message: "Tidak ada data pada periode ini." };
    }

    const { dataLaporan, kasirDetails, date1, date2 } = data;

    let totalItemAll = 0;
    let totalBeliAll = 0;
    let totalJualAll = 0;

    const rows = dataLaporan.map(item => {
        const detail = kasirDetails[item.idTransaksi] || [];
        const jumlahItem = detail.length;
        const totalBeli = detail.reduce((sum, d) => sum + (d.jumlah * d.harga_beli), 0);
        const totalJual = detail.reduce((sum, d) => sum + (d.jumlah * d.harga), 0);
        const profit = totalJual - totalBeli;

        totalItemAll += jumlahItem;
        totalBeliAll += totalBeli;
        totalJualAll += totalJual;

        return [
            item.idTransaksi,
            moment(item.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            item.kdPelanggan,
            item.namaPelanggan,
            jumlahItem,
            totalBeli,
            totalJual,
            profit,
        ];
    });

    const totalProfitAll = totalJualAll - totalBeliAll;

    const sheetData: (string | number)[][] = [
        ["LAPORAN RUGI LABA"],
        ["KOPERASI KONSUMEN KARYAWAN SARANDI KARYA NUGRAHA"],
        ["KOMPLEK SENTRIS BLOK E NO 8"],
        [`PERIODE: ${date1} - ${date2}`],
        [],
        ["No Transaksi", "Tanggal", "NIK", "Nama", "Jml Item", "Total Beli", "Total Jual", "Profit"],
        ...rows,
        [],
        ["", "", "", "Total", totalItemAll, totalBeliAll, totalJualAll, totalProfitAll],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = [
        { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 30 },
        { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];
    worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rugi Laba");

    const fileName = `laporan_rugi_laba_${moment(startDate).format("YYYYMMDD")}_${moment(endDate).format("YYYYMMDD")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    return { success: true };
}
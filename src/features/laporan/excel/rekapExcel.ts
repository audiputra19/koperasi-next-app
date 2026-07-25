import * as XLSX from "xlsx";
import moment from "moment-timezone";
import { fetchLaporanExcelData } from "./laporanExcel.utils";

export async function exportRekapExcel(
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
    let totalAll = 0;
    const totalMetode = { tunai: 0, kredit: 0, qris: 0 };

    const rows = dataLaporan.map(item => {
        const detail = kasirDetails[item.idTransaksi] || [];
        const jumlahItem = detail.length;

        let tunai = 0, kredit = 0, qris = 0;
        if (item.metode === 1) tunai = item.total;
        if (item.metode === 2) kredit = item.total;
        if (item.metode === 3) qris = item.total;

        totalItemAll += jumlahItem;
        totalAll += item.total;
        totalMetode.tunai += tunai;
        totalMetode.kredit += kredit;
        totalMetode.qris += qris;

        return [
            item.idTransaksi,
            moment(item.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            item.kdPelanggan,
            item.namaPelanggan,
            jumlahItem,
            item.total,
            tunai,
            kredit,
            qris,
        ];
    });

    const sheetData: (string | number)[][] = [
        ["LAPORAN PENJUALAN REKAP"],
        ["KOPERASI KONSUMEN KARYAWAN SARANDI KARYA NUGRAHA"],
        ["KOMPLEK SENTRIS BLOK E NO 8"],
        [`PERIODE: ${date1} - ${date2}`],
        [],
        ["No Transaksi", "Tanggal", "NIK", "Nama", "Jml Item", "Total", "Tunai", "Kredit", "QRIS"],
        ...rows,
        [],
        ["", "", "", "Total", totalItemAll, totalAll, totalMetode.tunai, totalMetode.kredit, totalMetode.qris],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = [
        { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 30 },
        { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
    ];
    worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 8 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 8 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 8 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 8 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap");

    const fileName = `laporan_penjualan_rekap_${moment(startDate).format("YYYYMMDD")}_${moment(endDate).format("YYYYMMDD")}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    return { success: true };
}
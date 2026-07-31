export interface DataLaporan {
    idTransaksi: string;
    tanggal: string;
    kdPelanggan: number;
    namaPelanggan: string;
    total: number;
    userBuat: string;
    userUbah: string;
    metode: number;
}

export interface DataLaporanPembelian {
    idTransaksi: string;
    tanggal: string;
    kdSupplier: number;
    namaSupplier: string;
    total: number;
    userBuat: string;
    userUbah: string;
    metode: number;
}
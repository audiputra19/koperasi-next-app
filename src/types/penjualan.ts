export interface DataKasir {
    barcode: string;
    kodeItem: string;
    namaItem: string;
    jenis: string;
    jumlah: number;
    satuan: string;
    harga: number;
}

export interface DataPelanggan {
    kodePelanggan: string | undefined;
    namaPelanggan: string | undefined;
    sumberPelanggan: string | undefined;
}

export interface KasirPayload {
    userBuat: string;
    total: number;
    metode: number;
    startDate: string;
    dataKasir: DataKasir[];
    dataPelanggan: DataPelanggan;
}

export interface EditKasirPayload {
    userBuat: string;
    total: number;
    metode: number;
    startDate: string;
    dataKasir: DataKasir[];
    dataPelanggan: DataPelanggan;
    idTransaksi: string;
}

export interface DaftarPenjualan {
    idTransaksi: string;
    tanggal: string;
    kdPelanggan: number;
    namaPelanggan: string;
    total: number;
    userBuat: string;
    userUbah: string;
    metode: number;
    sumber: string;
}

export interface DaftarPenjualanDetail {
    kodeItem: string;
    barcode: string;
    namaItem: string;
    jenis: string;
    jumlah: number;
    satuan: string
    harga: number;
    harga_beli: number;
}

export interface DeletePenjualan {
    message: string;
}

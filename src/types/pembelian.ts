export interface DataPembelian {
    kodeItem: string;
    namaItem: string;
    jenis: string;
    jumlah: number;
    satuan: string;
    harga: number;
    expireDate?: string;
}

export interface DataSupplier {
    kodeSupplier: string;
    namaSupplier: string;
}

export interface PembelianPayload {
    userBuat: string;
    total: number;
    metode: number;
    startDate: string;
    dataPembelian: DataPembelian[];
    dataSupplier: DataSupplier;
}

export interface EditPembelianPayload {
    userBuat: string;
    total: number;
    metode: number;
    startDate: string;
    dataPembelian: DataPembelian[];
    dataSupplier: DataSupplier;
    idTransaksi: string;
}

export interface DaftarPembelian {
    idTransaksi: string;
    tanggal: string;
    kdSupplier: string;
    namaSupplier: string;
    total: number;
    userBuat: string;
    userUbah: string;
    metode: number;
}

export interface DaftarPembelianDetail {
    kodeItem: string;
    barcode: string;
    namaItem: string;
    jenis: string;
    jumlah: number;
    satuan: string
    harga: number;
    expiredDate?: string;
}

export interface HargaItem {
    kdItem: string;
    tanggal: string;
    hargaBeli: number;
    hargaJual: number;
}
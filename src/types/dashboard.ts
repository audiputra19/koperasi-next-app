export interface TotalAnggota {
    total: number;
}

export interface TotalSupplier {
    total: number;
}

export interface TotalItem {
    total: number;
}

export interface RestockItem {
    kode: string;
    barcode: string;
    nama: string;
    jumlah: number;
    stok_minimal: number;
    rak: string;
}

export interface ExpiredItem {
    kode: string;
    barcode: string;
    nama: string;
    jumlah: number;
    rak: string;
    expiredDate: string;
}

export interface PopulerItem {
    nama: string;
    total: number;
}
export interface DaftarPelanggan {
    kode: string;
    nama: string;
    idKategori: number;
    limitBelanja: number;
    kredit: number;
}

export interface DaftarSupplier {
    kode: string;
    nama: string;
    alamat: string;
}

export interface DaftarItem {
    kode: string;
    barcode: string;
    nama: string;
    stok: number;
    satuan: string; 
    rak: string;
    jenis: string;
    hargaBeli: number;
    hargaJual: number;
    stokMinimal: number;
    status: number;
}

export interface MenuState {
    error?: string;
    success?: string;
}
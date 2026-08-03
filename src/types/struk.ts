export interface StrukItem {
    namaItem: string;
    jumlah: number;
    harga: number;
}

export interface StrukData {
    tanggal: string; // ISO string
    pelanggan: string;
    kasir: string;
    metode: string; // sudah berupa label, misal "Tunai (Cash)"
    items: StrukItem[];
    total: number;
}
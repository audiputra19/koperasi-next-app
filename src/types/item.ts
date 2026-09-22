export interface DeleteItem {
    message: string;
}

export interface KartuStokItem {
    no_transaksi: string;
    tanggal: string;
    keterangan: string;
    masuk: number;
    keluar: number;
    saldo: number;
    pelanggan: string;
}

export interface GetStockItemPayload {
    kode: string;
    tanggal_awal: string;
    tanggal_akhir: string;
}

export interface GetStockItemResponse {
    data: KartuStokItem[];
}
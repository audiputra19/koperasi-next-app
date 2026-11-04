export interface DataBelanja {
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
    sumberPelanggan?: string | undefined;
}

export interface DaftarBelanja {
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
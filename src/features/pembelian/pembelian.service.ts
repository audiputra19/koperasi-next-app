import { apiFetch } from "@/src/lib/apiClient"
import { DaftarPembelian, DaftarPembelianDetail, DeletePembelian, HargaItem } from "@/src/types/pembelian"

export const PembelianService = {
    getDaftarPembelian: async(): Promise<DaftarPembelian[]> => {
        return apiFetch<DaftarPembelian[]>('/get-pembelian', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getDaftarPembelianDetail: async(idTransaksi: string): Promise<DaftarPembelianDetail[]> => {
        return apiFetch<DaftarPembelianDetail[]>('/get-pembeliandetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idTransaksi }),
            cache: 'no-store'
        })
    },
    getHargaItem: async(kdItem: string): Promise<HargaItem[]> => {
        return apiFetch<HargaItem[]>('/get-hargaitem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ kdItem }),
            cache: 'no-store'
        })
    },
    deletePembelian: async (idTransaksi: string): Promise<DeletePembelian> => {
        return apiFetch<DeletePembelian>('/delete-pembelian', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idTransaksi }),
            cache: 'no-store'
        })
    },
    // deletePembelianDetail: async (idTransaksi: string): Promise<DeletePembelian> => {
    //     return apiFetch<DeletePembelian>('/delete-pembeliandetail', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ idTransaksi }),
    //         cache: 'no-store'
    //     })
    // }
}
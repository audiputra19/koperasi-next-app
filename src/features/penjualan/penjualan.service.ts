import { apiFetch } from "@/src/lib/apiClient"
import { DaftarPenjualan, DaftarPenjualanDetail, DeletePenjualan } from "@/src/types/penjualan"

export const PenjualanService = {
    getDaftarPenjualan: async(tglDari?: string, tglSampai?: string): Promise<DaftarPenjualan[]> => {
        return apiFetch<DaftarPenjualan[]>('/get-kasir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tglDari, tglSampai }),
            cache: 'no-store'
        })
    },
    getDaftarPenjualanDetail: async(idTransaksi: string): Promise<DaftarPenjualanDetail[]> => {
        return apiFetch<DaftarPenjualanDetail[]>('/get-kasirdetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idTransaksi }),
            cache: 'no-store'
        })
    },
    deletePenjualan: async (idTransaksi: string): Promise<DeletePenjualan> => {
        return apiFetch<DeletePenjualan>('/delete-kasir', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idTransaksi }),
            cache: 'no-store'
        })
    },
}
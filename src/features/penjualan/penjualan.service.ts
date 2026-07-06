import { apiFetch } from "@/src/lib/apiClient"
import { DaftarPenjualan, DaftarPenjualanDetail } from "@/src/types/penjualan"

export const PenjualanService = {
    getDaftarPenjualan: async(): Promise<DaftarPenjualan[]> => {
        return apiFetch<DaftarPenjualan[]>('/get-kasir', {
            method: 'POST',
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
}
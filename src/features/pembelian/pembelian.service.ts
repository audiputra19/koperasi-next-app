import { apiFetch } from "@/src/lib/apiClient"
import { DaftarPembelian, DaftarPembelianDetail } from "@/src/types/pembelian"

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
}
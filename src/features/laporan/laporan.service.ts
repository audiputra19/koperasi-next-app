import { apiFetch } from "@/src/lib/apiClient"
import { DataLaporan } from "@/src/types/laporan"

export const LaporanService = {
    getLaporan: async(date1: string | null, date2: string | null, kdPelanggan: string | undefined): Promise<DataLaporan[]> => {
        return apiFetch<DataLaporan[]>('/get-laporan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date1, date2, kdPelanggan }),
            cache: 'no-store'
        })
    },
}
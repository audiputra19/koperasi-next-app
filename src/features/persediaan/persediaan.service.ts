import { apiFetch } from "@/src/lib/apiClient"
import { DeleteSon, SonDetailItem, SonListItem } from "@/src/types/son"

export const SonService = {
    getDaftarSon: async (): Promise<SonListItem[]> => {
        return apiFetch<SonListItem[]>('/get-son', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getDaftarSonDetail: async (sonNumber: string): Promise<SonDetailItem[]> => {
        return apiFetch<SonDetailItem[]>('/get-sondetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sonNumber }),
            cache: 'no-store'
        })
    },
    deleteSon: async (sonNumber: string): Promise<DeleteSon> => {
        return apiFetch<DeleteSon>('/delete-son', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sonNumber }),
            cache: 'no-store'
        })
    },
}
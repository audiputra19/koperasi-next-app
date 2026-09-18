import { apiFetch } from "@/src/lib/apiClient"
import { DeleteItem } from "@/src/types/item"

export const ItemService = {
    deleteItem: async (kode: string): Promise<DeleteItem> => {
        return apiFetch<DeleteItem>('/delete-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ kode }),
            cache: 'no-store'
        })
    },
}
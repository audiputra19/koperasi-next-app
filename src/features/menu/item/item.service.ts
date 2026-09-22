import { apiFetch } from "@/src/lib/apiClient"
import { DeleteItem, GetStockItemPayload, GetStockItemResponse } from "@/src/types/item"

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

    getStockItem: async (payload: GetStockItemPayload): Promise<GetStockItemResponse> => {
        return apiFetch<GetStockItemResponse>('/get-stock-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-store'
        })
    },
}
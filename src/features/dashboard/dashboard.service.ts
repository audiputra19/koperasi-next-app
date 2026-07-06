import { ExpiredItem, PopulerItem, RestockItem, TotalAnggota, TotalItem, TotalSupplier } from "../../types/dashboard";
import { apiFetch } from "../../lib/apiClient";

export const DashboardService = {
    getTotalAnggota: async(): Promise<TotalAnggota> => {
        return apiFetch<TotalAnggota>('/get-total-anggota', {
            method: 'POST',
            next: { revalidate: 300 }
        })
    },
    getTotalSupllier: async(): Promise<TotalSupplier> => {
        return apiFetch<TotalSupplier>('/get-total-supplier', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getTotalItem: async(): Promise<TotalItem> => {
        return apiFetch<TotalItem>('/get-total-item', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getPopulerItem: async(): Promise<PopulerItem> => {
        return apiFetch<PopulerItem>('/get-populer-item', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getRestockItem: async(): Promise<RestockItem> => {
        return apiFetch<RestockItem>('/get-limit-item', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getExpiredItem: async(): Promise<ExpiredItem> => {
        return apiFetch<ExpiredItem>('/get-expired-item', {
            method: 'POST',
            cache: 'no-store'
        })
    },
}
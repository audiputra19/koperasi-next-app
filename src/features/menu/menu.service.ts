import { DaftarItem, DaftarPelanggan, DaftarSupplier } from "../../types/menu";
import { apiFetch } from "../../lib/apiClient";

export const MenuService = {
    getDaftarPelanggan: async(): Promise<DaftarPelanggan[]> => {
        return apiFetch<DaftarPelanggan[]>('/get-pelanggan', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getDaftarSupplier: async(): Promise<DaftarSupplier[]> => {
        return apiFetch<DaftarSupplier[]>('/get-supplier', {
            method: 'POST',
            cache: 'no-store'
        })
    },
    getDaftarItems: async(): Promise<DaftarItem[]> => {
        return apiFetch<DaftarItem[]>('/get-items', {
            method: 'POST',
            cache: 'no-store'
        })
    },
}
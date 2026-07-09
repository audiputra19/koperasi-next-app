"use server";

import { BASE_URL } from "@/src/lib/apiClient";
import { MenuState } from "@/src/types/menu";
import { DaftarPenjualanDetail, EditKasirPayload, KasirPayload } from "@/src/types/penjualan";
import { revalidatePath } from "next/cache";
import { PenjualanService } from "./penjualan.service";

export async function addTransaksiKasir(
    payload: KasirPayload
): Promise<MenuState> {
    try {
        const response = await fetch(`${BASE_URL}/input-kasir`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal menyimpan transaksi ke server." };
        }

        revalidatePath("/inputKasir");
        return { success: result.message || "Transaksi berhasil disimpan!" };
    } catch (error) {
        console.error("Add Transaksi Kasir Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}

export async function editTransaksiKasir(
    payload: EditKasirPayload
): Promise<MenuState> {
    try {
        const response = await fetch(`${BASE_URL}/update-kasir`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal menyimpan transaksi ke server." };
        }

        revalidatePath("/inputKasir");
        return { success: result.message || "Transaksi berhasil disimpan!" };
    } catch (error) {
        console.error("Edit Transaksi Kasir Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}
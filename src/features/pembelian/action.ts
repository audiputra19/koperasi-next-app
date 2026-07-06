"use server";

import { DaftarPembelianDetail, EditPembelianPayload, PembelianPayload } from "@/src/types/pembelian";
import { PembelianService } from "./pembelian.service";
import { MenuState } from "@/src/types/menu";
import { BASE_URL } from "@/src/lib/apiClient";
import { revalidatePath } from "next/cache";

export async function addTransaksiPembelian(
    payload: PembelianPayload
): Promise<MenuState> {
    try {
        const response = await fetch(`${BASE_URL}/input-pembelian`, {
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

        revalidatePath("/inputPembelian");
        return { success: result.message || "Transaksi berhasil disimpan!" };
    } catch (error) {
        console.error("Add Transaksi Pembelian Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}

export async function editTransaksiPembelian(
    payload: EditPembelianPayload
): Promise<MenuState> {
    try {
        const response = await fetch(`${BASE_URL}/update-pembelian`, {
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

        revalidatePath("/inputPembelian");
        return { success: result.message || "Transaksi berhasil disimpan!" };
    } catch (error) {
        console.error("Edit Transaksi Kasir Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}

export async function getDetailPembelianAction(idTransaksi: string): Promise<DaftarPembelianDetail[]> {
    try {
        return await PembelianService.getDaftarPembelianDetail(idTransaksi);
    } catch (error) {
        console.error("Server Action Detail Error:", error);
        throw new Error("Gagal terhubung ke server");
    }
}
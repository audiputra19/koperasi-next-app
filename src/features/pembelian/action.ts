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

export async function addHargaItem(
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const kdItem = formData.get("kdItem");
    const hargaBeli = formData.get("hargaBeli");
    const hargaJual = formData.get("hargaJual");

    try {
        const response = await fetch(`${BASE_URL}/input-hargaitem`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                kdItem,
                hargaBeli,
                hargaJual
            })
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal menambahkan harga item ke server." };
        }

        revalidatePath("/daftarPembelian");
        
        return { success: result.message || "Harga item berhasil ditambahkan" };
        
    } catch (error) {
        console.error("Add Harga Item Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}
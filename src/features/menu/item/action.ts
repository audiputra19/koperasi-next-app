"use server";

import { BASE_URL } from "@/src/lib/apiClient";
import { MenuState } from "@/src/types/menu";
import { revalidatePath } from "next/cache";

export async function addItem(
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const barcode = formData.get("barcode");
    const nama = formData.get("nama");
    const stok = formData.get("stok");
    const satuan = formData.get("satuan");
    const rak = formData.get("rak");
    const jenis = formData.get("jenis");
    const hargaBeli = formData.get("hargaBeli");
    const hargaJual = formData.get("hargaJual");
    const stokMinimal = formData.get("stokMinimal");
    const status = formData.get("status");

    try {
        const response = await fetch(`${BASE_URL}/input-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                barcode,
                nama,
                stok,
                satuan,
                rak,
                jenis,
                hargaBeli,
                hargaJual,
                stokMinimal,
                status
            })
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal menambahkan Item ke server." };
        }

        revalidatePath("/daftarItem"); 
        
        return { success: result.message || "Item berhasil ditambahkan" };
        
    } catch (error) {
        console.error("Add Item Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}

export async function editItem (
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const kdItem = formData.get("id_item");
    const barcode = formData.get("barcode");
    const nama = formData.get("nama");
    const stok = formData.get("stok");
    const satuan = formData.get("satuan");
    const rak = formData.get("rak");
    const jenis = formData.get("jenis");
    const hargaBeli = formData.get("hargaBeli");
    const hargaJual = formData.get("hargaJual");
    const stokMinimal = formData.get("stokMinimal");
    const status = formData.get("status");

    if(!kdItem) {
        return { error: "ID Item tidak ditemukan" };
    }

    try {
        const response = await fetch(`${BASE_URL}/input-items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                kdItem,
                barcode,
                nama,
                stok,
                satuan,
                rak,
                jenis,
                hargaBeli,
                hargaJual,
                stokMinimal,
                status
            })
        });
        
        const result = await response.json();

        if(!response.ok) {
            return { error: result.message || "Gagal memperbarui data Item." };
        }

        revalidatePath("/daftarItem");

        return {success: result.message || "Item berhasil diperbarui" };

    } catch (error) {
        console.error("Edit Item Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}
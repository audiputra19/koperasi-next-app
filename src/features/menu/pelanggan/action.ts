"use server";

import { BASE_URL } from "@/src/lib/apiClient";
import { MenuState } from "@/src/types/menu";
import { revalidatePath } from "next/cache";

export async function editPelanggan (
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const id = formData.get("id_pelanggan");
    const idKategori = formData.get("id_kategori");
    const limitBelanja = formData.get("limit_belanja");
    const kredit = formData.get("kredit");

    if(!id) {
        return { error: "ID Pelanggan tidak ditemukan" };
    }

    if(!idKategori || !limitBelanja || !kredit) {
        return { error: "Form wajib diisi." };
    }

    try {
        const response = await fetch(`${BASE_URL}/input-pelanggan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                kode: id,
                idKategori: idKategori,
                limitBelanja: limitBelanja,
                kredit: kredit
            })
        });

        const result = await response.json();

        if(!response.ok) {
            return { error: result.message || "Gagal memperbarui data pelanggan." };
        }

        revalidatePath("/daftarPelanggan");

        return {success: result.message || "Pelanggan berhasil diperbarui" };
    } catch (error) {
        console.error("Edit Pelanggan Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}
"use server";

import { BASE_URL } from "@/src/lib/apiClient";
import { decrypt } from "@/src/lib/session";
import { MenuState } from "@/src/types/menu";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function editPelanggan (
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const cookieStore = await cookies();
    const session = await decrypt(cookieStore.get("session")?.value);

    if (!session?.userId) {
        return { error: "Sesi tidak valid, silakan login ulang." };
    }

    const isAnggota = session.role === "Anggota";
    const isKasir = session.role === "Kasir";
    const password = formData.get("password") as string | null;

    let payload: Record<string, unknown>;

    if (isAnggota || isKasir) {
        // Anggota
        if (!password) {
            return { error: "Password wajib diisi." };
        }

        payload = {
            kode: session.userId,
            password,
        };
    } else {
        // Admin/Pengawas: proses form lengkap seperti biasa
        const id = formData.get("id_pelanggan");
        const idKategori = formData.get("id_kategori");
        const limitBelanja = formData.get("limit_belanja");
        const kredit = formData.get("kredit");
        const role = formData.get("role");

        if (!id) {
            return { error: "ID Pelanggan tidak ditemukan" };
        }

        if (!idKategori || !limitBelanja || !kredit) {
            return { error: "Form wajib diisi." };
        }

        payload = {
            kode: id,
            idKategori,
            limitBelanja,
            kredit,
            role,
            password: password || undefined,
        };
    }

    try {
        const response = await fetch(`${BASE_URL}/input-pelanggan`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload)
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
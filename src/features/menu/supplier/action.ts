"use server";

import { BASE_URL } from "@/src/lib/apiClient";
import { MenuState } from "@/src/types/menu";
import { revalidatePath } from "next/cache";

export async function addSupplier(
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const namaSupplier = formData.get("nama_supplier");
    const alamat = formData.get("alamat");

    if(!namaSupplier || !alamat) {
        return { error: "Form wajib diisi." };
    }

    try {
        const response = await fetch(`${BASE_URL}/input-supplier`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                nama: namaSupplier,
                alamat: alamat
            })
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal menambahkan supplier ke server." };
        }

        revalidatePath("/daftarSupplier");
        
        return { success: result.message || "Supplier berhasil ditambahkan" };
        
    } catch (error) {
        console.error("Add Supplier Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}

export async function editSupplier (
    prevState: MenuState | null,
    formData: FormData
): Promise<MenuState> {
    const id = formData.get("id_supplier");
    const namaSupplier = formData.get("nama_supplier");
    const alamat = formData.get("alamat");

    if(!id) {
        return { error: "ID Supplier tidak ditemukan" };
    }

    if(!namaSupplier || !alamat) {
        return { error: "Form wajib diisi." };
    }

    try {
        const response = await fetch(`${BASE_URL}/input-supplier`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                kdSupp: id,
                nama: namaSupplier,
                alamat: alamat
            })
        });
        
        const result = await response.json();

        if(!response.ok) {
            return { error: result.message || "Gagal memperbarui data supplier." };
        }

        revalidatePath("/daftarSupplier");

        return {success: result.message || "Supplier berhasil diperbarui" };

    } catch (error) {
        console.error("Edit Supplier Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}
"use server";

import { BASE_URL } from "@/src/lib/apiClient";
import { MenuState } from "@/src/types/menu";
import { SonPayload } from "@/src/types/son";
import { revalidatePath } from "next/cache";

export type SonEditPayload = {
    sonNumber: string;
    updatedBy?: string;
    items: SonPayload["items"];
};

export async function addSon(
    payload: SonPayload
): Promise<MenuState> {
    try {
        const response = await fetch(`${BASE_URL}/input-son`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal menyimpan data SON ke server." };
        }

        revalidatePath("/daftarSon");
        return { success: result.message || "Data SON berhasil disimpan!" };
    } catch (error) {
        console.error("Add Son Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}

export async function editSon(
    payload: SonEditPayload
): Promise<MenuState> {
    try {
        const response = await fetch(`${BASE_URL}/update-son`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: result.message || "Gagal mengubah data SON di server." };
        }

        revalidatePath("/daftarSon");
        return { success: result.message || "Data SON berhasil diubah!" };
    } catch (error) {
        console.error("Edit Son Error:", error);
        return { error: "Gagal terhubung ke server." };
    }
}
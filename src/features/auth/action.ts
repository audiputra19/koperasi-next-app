"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession } from "../../lib/session";
import bcrypt from "bcryptjs";
import { AuthState, UserData } from "../../types/auth";

export async function login(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
    const userId = formData.get("userId");
    const password = formData.get("password");

    if(!userId || !password) {
        return { error: "Semua field harus diisi." }
    }

    try {
        const response = await fetch(`https://api-koperasi-psi.vercel.app/auth/user`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
            },
        });

        if (!response.ok) {
            return { error: "Gagal mengambil data autentikasi dari server." };
        }

        const userList: UserData[] = await response.json();

        const matchedUser = userList.find((user) => user.id.toString() === userId.toString());

        if(!matchedUser || !matchedUser.password) {
            return { error: "ID atau password salah." };
        }

        const isPasswordValid = await bcrypt.compare(password as string, matchedUser.password);

        if (!isPasswordValid) {
            return { error: "ID atau password salah." };
        }

        await createSession(matchedUser.id.toString(), {
            nama: matchedUser.nama,
            hak_akses: matchedUser.hak_akses,
            kategori: matchedUser.kategori
        });

    } catch (error) {
        console.error("External API Auth Error:", error);
        return { error: "Gagal terhubung ke server." };
    }

    redirect("/dashboard");
}

export async function logout(prevState: AuthState, formData: FormData): Promise<AuthState> {
    try {
        await deleteSession();
    } catch (error) {
        console.error("Gagal logout:", error);
        return { error: "Gagal melakukan logout." }
    }

    redirect('/login');
}
import { JWTPayload } from "jose";

export interface UserData {
    id: number;
    nama: string;
    password?: string;
    role: string;
}

export interface SessionPayload extends JWTPayload {
    userId: string;
    nama: string;
    role: "Admin" | "Kasir" | "Pengawas" | "Anggota";
    expiresAt: Date;
}

export interface AuthState {
    error?: string;
    success?: boolean | string;
    redirectTo?: string;
}

export type Role = "Admin" | "Kasir" | "Pengawas" | "Anggota";
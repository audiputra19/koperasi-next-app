import { JWTPayload } from "jose";

export interface UserData {
    id: number;
    nama: string;
    password?: string;
    hak_akses: number;
    kategori: number;
}

export interface SessionPayload extends JWTPayload {
    userId: string;
    nama: string;
    hakAkses: number;
    kategori: number;
    expiresAt: Date;
}

export interface AuthState {
    error?: string;
    success?: boolean;
}
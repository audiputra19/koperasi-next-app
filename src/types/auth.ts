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
    role: string;
    expiresAt: Date;
}

export interface AuthState {
    error?: string;
    success?: boolean;
}
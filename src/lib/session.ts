import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { SessionPayload, UserData } from "../types/auth";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(encodedKey);
}

export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ["HS256"],
        });       
        return payload as SessionPayload;
    } catch (error) {
        return null
    }
}

export async function createSession(userId: string, userInfo: Omit<UserData, 'id' | 'password'>) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ 
        userId, 
        nama: userInfo.nama,
        hakAkses: userInfo.hak_akses,
        kategori: userInfo.kategori,
        expiresAt 
    });

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession(): Promise<SessionPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if(!token) return null;

    return await decrypt(token);
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
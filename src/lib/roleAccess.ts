import { Role } from "@/src/types/auth";

export const routeAccess: Record<string, Role[]> = {
    "/dashboard": ["Admin", "Pengawas", "Kasir"],
    "/laporan": ["Admin", "Pengawas", "Kasir", "Anggota"],
    "/daftarItem": ["Admin", "Kasir", "Pengawas"],
    "/daftarPelanggan": ["Admin", "Kasir", "Anggota"],
    "/daftarSupplier": ["Admin", "Kasir"],
    "/daftarPembelian": ["Admin", "Kasir", "Pengawas"],
    "/inputPembelian": ["Admin", "Kasir"],
    "/daftarPenjualan": ["Admin", "Pengawas", "Kasir"],
    "/inputKasir": ["Admin", "Kasir"],
};

export function getDefaultRoute(role?: Role): string {
    switch (role) {
        case "Kasir":
            return "/inputKasir";
        case "Pengawas":
            return "/laporan";
        case "Admin":
            return "/dashboard";
        case "Anggota":
            return "/laporan";
        default:
            return "/login";
    }
}

export function isRouteAllowed(path: string, role: Role): boolean {
    const allowed = routeAccess[path];
    if (!allowed) return true;
    return allowed.includes(role);
}
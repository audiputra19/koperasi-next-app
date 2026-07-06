import { MenuService } from "@/src/features/menu/menu.service";
import DaftarLaporanClient from "./DaftarLaporanClient";

export default async function Laporan() {
    const [daftarPelangganRaw] = await Promise.all([
        MenuService.getDaftarPelanggan(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarLaporanClient dataPelanggan={daftarPelangganRaw} />
        </main>            
    );
}
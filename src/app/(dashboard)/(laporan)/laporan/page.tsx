import { MenuService } from "@/src/features/menu/menu.service";
import DaftarLaporanClient from "./DaftarLaporanClient";
import { getSession } from "@/src/lib/session";

export default async function Laporan() {
    const [daftarPelangganRaw] = await Promise.all([
        MenuService.getDaftarPelanggan(),
    ]);
    const session = await getSession();

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarLaporanClient 
                dataPelanggan={daftarPelangganRaw}
                session={session}
            />
        </main>            
    );
}
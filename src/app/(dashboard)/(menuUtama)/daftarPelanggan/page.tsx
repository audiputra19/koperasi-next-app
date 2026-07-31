import { MenuService } from "@/src/features/menu/menu.service";
import DaftarPelangganClient from "./DaftarPelangganClient";
import { getSession } from "@/src/lib/session";

export default async function DaftarPelangganPage() {
    const session = await getSession();
    const isAnggota = session?.role === "Anggota";
    const isKasir = session?.role === "Kasir";

    const [daftarPelangganRaw] = await Promise.all([
        MenuService.getDaftarPelanggan((isAnggota || isKasir) ? session.userId : undefined),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPelangganClient 
                dataAwal={daftarPelangganRaw as []}
                session={session}
            />
        </main>            
    );
}
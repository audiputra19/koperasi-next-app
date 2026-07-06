import { MenuService } from "@/src/features/menu/menu.service";
import DaftarPelangganClient from "./DaftarPelangganClient";

export default async function DaftarPelangganPage() {
    const [daftarPelangganRaw] = await Promise.all([
        MenuService.getDaftarPelanggan(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPelangganClient dataAwal={daftarPelangganRaw as []} />
        </main>            
    );
}
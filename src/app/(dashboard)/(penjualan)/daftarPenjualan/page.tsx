import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import DaftarPenjualanClient from "./DaftarPenjualanClient";
import { getSession } from "@/src/lib/session";

export default async function DaftarPenjualanPage() {
    const session = await getSession();
    const [daftarPenjualanRaw] = await Promise.all([
        PenjualanService.getDaftarPenjualan(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPenjualanClient 
                dataAwal={daftarPenjualanRaw as []}
                session={session}
            />
        </main>            
    );
}
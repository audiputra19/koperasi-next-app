import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import DaftarPenjualanClient from "./DaftarPenjualanClient";

export default async function DaftarPenjualanPage() {
    const [daftarPenjualanRaw] = await Promise.all([
        PenjualanService.getDaftarPenjualan(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPenjualanClient 
                dataAwal={daftarPenjualanRaw as []}
            />
        </main>            
    );
}
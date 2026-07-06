import { PembelianService } from "@/src/features/pembelian/pembelian.service";
import DaftarPembelianClient from "./DaftarPembelianClient";

export default async function DaftarSupplierPage() {
    const [daftarPembelianRaw] = await Promise.all([
        PembelianService.getDaftarPembelian(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPembelianClient dataAwal={daftarPembelianRaw as []} />
        </main>            
    );
}
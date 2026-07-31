import { PembelianService } from "@/src/features/pembelian/pembelian.service";
import DaftarPembelianClient from "./DaftarPembelianClient";
import { getSession } from "@/src/lib/session";

export default async function DaftarSupplierPage() {
    const session = await getSession();
    const [daftarPembelianRaw] = await Promise.all([
        PembelianService.getDaftarPembelian(),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPembelianClient 
                dataAwal={daftarPembelianRaw as []} 
                session={session}
            />
        </main>            
    );
}
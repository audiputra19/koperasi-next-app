import { PembelianService } from "@/src/features/pembelian/pembelian.service";
import DaftarPembelianClient from "./DaftarPembelianClient";
import { getSession } from "@/src/lib/session";
import moment from "moment-timezone";

interface PageProps {
    searchParams: Promise<{ dari?: string; sampai?: string }>;
}

export default async function DaftarSupplierPage({ searchParams }: PageProps) {
    const session = await getSession();
    const params = await searchParams;

    const hariIni = moment().tz("Asia/Jakarta");
    const tglDari = params.dari || hariIni.clone().startOf("month").format("YYYY-MM-DD");
    const tglSampai = params.sampai || hariIni.format("YYYY-MM-DD");

    const [daftarPembelianRaw] = await Promise.all([
        PembelianService.getDaftarPembelian(tglDari, tglSampai),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPembelianClient 
                dataAwal={daftarPembelianRaw as []} 
                session={session}
                tglDari={tglDari}
                tglSampai={tglSampai}
            />
        </main>            
    );
}
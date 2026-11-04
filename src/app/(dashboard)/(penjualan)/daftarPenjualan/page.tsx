import { PenjualanService } from "@/src/features/penjualan/penjualan.service";
import DaftarPenjualanClient from "./DaftarPenjualanClient";
import { getSession } from "@/src/lib/session";
import moment from "moment-timezone";

interface PageProps {
    searchParams: Promise<{ dari?: string; sampai?: string }>;
}

export default async function DaftarPenjualanPage({ searchParams }: PageProps) {
    const session = await getSession();
    const params = await searchParams;

    const hariIni = moment().tz("Asia/Jakarta");
    const tglDari = params.dari || hariIni.clone().startOf("month").format("YYYY-MM-DD");
    const tglSampai = params.sampai || hariIni.format("YYYY-MM-DD");

    const [daftarPenjualanRaw] = await Promise.all([
        PenjualanService.getDaftarPenjualan(tglDari, tglSampai),
    ]);

    return (
        <main className="p-5 w-full flex justify-center">
            <DaftarPenjualanClient 
                dataAwal={daftarPenjualanRaw as []}
                session={session}
                tglDari={tglDari}
                tglSampai={tglSampai}
            />
        </main>            
    );
}
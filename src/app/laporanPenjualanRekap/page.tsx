import { Suspense } from "react";
import LaporanPenjualanRekapClient from "./LaporanPenjualanRekapClient";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default async function LaporanPenjualanRekap() {

    return (
        <main className="p-5 w-full flex justify-center">
            <Suspense fallback={<Loading />}>
                <LaporanPenjualanRekapClient />
            </Suspense>
        </main>            
    );
}
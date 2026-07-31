import { Suspense } from "react";
import LaporanKasirClient from "./LaporanKasirClient";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default async function LaporanPenjualanDetail() {

    return (
        <main className="p-5 w-full flex justify-center">
            <Suspense fallback={<Loading />}>
                <LaporanKasirClient />
            </Suspense>
        </main>            
    );
}
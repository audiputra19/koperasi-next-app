import { Suspense } from "react";
import LaporanPenjualanDetailClient from "./LaporanPenjualanDetailClient";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default async function LaporanPenjualanDetail() {

    return (
        <main className="p-5 w-full flex justify-center">
            <Suspense fallback={<Loading />}>
                <LaporanPenjualanDetailClient />
            </Suspense>
        </main>            
    );
}
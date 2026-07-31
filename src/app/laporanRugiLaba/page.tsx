import { Suspense } from "react";
import LaporanPenjualanRugiLabaClient from "./LaporanPenjualanRugiLabaClient";
import Loading from "./loading";

export const dynamic = "force-dynamic";

export default async function LaporanPenjualanRugiLaba() {

    return (
        <main className="p-5 w-full flex justify-center">
            <Suspense fallback={<Loading />}>
                <LaporanPenjualanRugiLabaClient />
            </Suspense>
        </main>            
    );
}
'use client';

import DaftarPenjualanTable from '@/src/components/penjualan/DaftarPenjualanTable';
import { SessionPayload } from '@/src/types/auth';

interface DaftarPenjualanClientProps {
    dataAwal: [];
    session: SessionPayload | null;
    tglDari: string;
    tglSampai: string;
}

export default function DaftarPenjualanClient({ dataAwal, session, tglDari, tglSampai }: DaftarPenjualanClientProps) {

    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">

            <DaftarPenjualanTable 
                dataAwal={dataAwal}
                session={session}
                tglDari={tglDari}
                tglSampai={tglSampai}
            />
        </div>
    );
}
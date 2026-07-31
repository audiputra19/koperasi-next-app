'use client';

import DaftarPembelianTable from '@/src/components/pembelian/DaftarPembelianTable';
import { SessionPayload } from '@/src/types/auth';
import { DaftarPembelian } from '@/src/types/pembelian';

interface DaftarPembelianClientProps {
    dataAwal: DaftarPembelian[];
    session: SessionPayload | null;
}

export default function DaftarPembelianClient({ dataAwal, session }: DaftarPembelianClientProps) {
    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">
            <DaftarPembelianTable 
                dataAwal={dataAwal} 
                session={session}
            />
        </div>
    );
}
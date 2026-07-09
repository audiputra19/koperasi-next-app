'use client';

import DaftarPembelianTable from '@/src/components/pembelian/DaftarPembelianTable';
import { DaftarPembelian } from '@/src/types/pembelian';

interface DaftarPembelianClientProps {
    dataAwal: DaftarPembelian[];
}

export default function DaftarPembelianClient({ dataAwal }: DaftarPembelianClientProps) {
    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">
            <DaftarPembelianTable 
                dataAwal={dataAwal} 
            />
        </div>
    );
}
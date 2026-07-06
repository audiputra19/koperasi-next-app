'use client';

import DaftarPenjualanTable from '@/src/components/penjualan/DaftarPenjualanTable';

interface DaftarPenjualanClientProps {
    dataAwal: [];
}

export default function DaftarPenjualanClient({ dataAwal }: DaftarPenjualanClientProps) {

    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">

            <DaftarPenjualanTable 
                dataAwal={dataAwal} 
            />
        </div>
    );
}
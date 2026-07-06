"use client";

import { Autocomplete } from "@/src/components/common/AutoComplete";
import { useLaporanStore } from "@/src/store/useLaporanStore";
import { DaftarPelanggan } from "@/src/types/menu";

interface DaftarLaporanClientProps {
    dataPelanggan: DaftarPelanggan[];
}

export default function DaftarLaporanClient({ dataPelanggan }: DaftarLaporanClientProps) {

    const { 
        startDate, 
        endDate, 
        listPelanggan, 
        setStartDate, 
        setEndDate, 
        setListPelanggan 
    } = useLaporanStore();
     
    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">
            <div className="flex items-center gap-5">
                <div className="flex flex-col gap-1">
                    <label htmlFor="tanggal" className="block text-sm font-medium text-gray-500">
                        Periode
                    </label>
                    <input 
                        type="date" 
                        className="input" 
                        value={startDate} 
                        onChange={(e) => setStartDate(e.target.value)} 
                    />
                </div>
                <p className="mt-5">-</p>
                <div className="flex flex-col gap-1">
                    <label htmlFor="tanggal" className="block text-sm font-medium text-base-200">
                        Tanggal 2
                    </label>
                    <input 
                        type="date" 
                        className="input" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} 
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="pelanggan" className="block text-sm font-medium text-gray-500">
                        Pelanggan
                    </label>
                    <Autocomplete 
                        options={dataPelanggan}
                        placeholder="Ketik nama atau kode pelanggan..."
                        selectedValue={listPelanggan?.namaPelanggan || ""}
                        valueKey="kode"
                        labelKey="nama"
                        onSelect={(pelanggan) => {
                            setListPelanggan({
                                kodePelanggan: pelanggan.kode,
                                namaPelanggan: pelanggan.nama
                            });
                        }}
                    />
                </div>
            </div> 
        </div>
    )
}
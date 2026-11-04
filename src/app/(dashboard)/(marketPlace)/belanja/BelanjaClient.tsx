'use client';

import { Autocomplete } from "@/src/components/ui/AutoComplete";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/cn";
import { useBelanjaStore } from "@/src/store/useBelanjaStore";
import { SessionPayload } from "@/src/types/auth";
import { DaftarBelanja, DataPelanggan } from "@/src/types/belanja";
import { DaftarItem } from "@/src/types/menu";
import { ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";

type TableBelanja = DaftarBelanja & Record<string, unknown>;

interface DaftarItemClientProps {
    dataAwal: DaftarItem[];
    session: SessionPayload | null;
}

export default function BelanjaClient({ dataAwal, session }: DaftarItemClientProps) {
    const [keyword, setKeyword] = useState<string>("");

    const handleSelectBarang = (selected: DaftarItem) => {
        setKeyword(selected.nama);  // supaya kalau user klik dropdown, grid ikut ke-filter sesuai yang dipilih
    };

    const filteredItems = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return dataAwal;
        return dataAwal.filter((item) =>
            (item.nama ?? "").toLowerCase().includes(q) ||
            (item.barcode ?? "").toLowerCase().includes(q) ||
            (item.kode ?? "").toLowerCase().includes(q)
        );
    }, [dataAwal, keyword]);

    const handleCart = (p: DaftarItem) => {

        const dataPelanggan: DataPelanggan = {
            kodePelanggan: String(session?.userId),
            namaPelanggan: String(session?.nama),
        };

        const dataBelanja = {
            barcode: p.barcode,
            kodeItem: p.kode,
            namaItem: p.nama,
            jenis: p.jenis,
            jumlah: 1,
            satuan: p.satuan,
            harga: p.hargaJual,
        };

        useBelanjaStore.getState().setListPelanggan(dataPelanggan);
        useBelanjaStore.getState().addBarang(dataBelanja);
    };

    return (
        <div className="w-full max-w-[1000px]">
            <div className="w-full max-w-md">
                <Autocomplete
                    options={dataAwal}
                    placeholder="Ketik nama atau barcode item..."
                    selectedValue={keyword}
                    keepSelected
                    valueKey="barcode"
                    labelKey="nama"
                    onSelect={handleSelectBarang}
                    onQueryChange={setKeyword}
                />
            </div>
            <div className={cn(
                "grid grid-cols-2 gap-3 mt-5",
                "md:grid-cols-3",
                "lg:grid-cols-4 lg:gap-5"
            )}>
                {filteredItems.map((item, index) => {

                    return (
                        <div 
                            key={item.kode}
                            className={cn(
                                "border border-base-300 bg-base-100 shadow-lg shadow-black/5 rounded-xl flex flex-col"
                            )}
                        >
                            <div className="p-1 flex flex-col flex-1">
                                {/* <Image 
                                    src={noImage}
                                    alt="Login Image"
                                    className="bg-secondary/30 rounded-lg w-full h-40 object-cover"
                                    priority
                                /> */}
                                <div className="flex flex-col gap-2 p-2 text-sm flex-1">
                                    <div className="line-clamp-2 min-h-[2.5em]">
                                        {item.nama}
                                    </div>
                                    <div className="font-bold text-lg">
                                        Rp. {item.hargaJual.toLocaleString("id-ID")}
                                    </div>
                                    <div className="mt-auto">
                                        <Button
                                            variant="primary"
                                            className="w-full flex gap-2"
                                            onClick={() => handleCart(item)}
                                            disabled
                                        >
                                        <ShoppingCart size={18} /> Keranjang
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* <CartPanel /> */}
        </div>
    )
}
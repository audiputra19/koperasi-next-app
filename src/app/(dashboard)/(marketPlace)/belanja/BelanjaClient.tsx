'use client';

import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/cn";
import { DaftarItem } from "@/src/types/menu";
import { Package, PackageSearch, ShoppingCart } from "lucide-react";
import { Autocomplete } from "@/src/components/ui/AutoComplete";
import { useMemo, useState } from "react";
import { DataPelanggan } from "@/src/types/belanja";
import { useBelanjaStore } from "@/src/store/useBelanjaStore";
import { SessionPayload } from "@/src/types/auth";

interface DaftarItemClientProps {
    dataAwal: DaftarItem[];
    session: SessionPayload | null;
}

export default function BelanjaClient({ dataAwal, session }: DaftarItemClientProps) {
    const [keyword, setKeyword] = useState<string>("");

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
            <div className="flex flex-col gap-1">
                <h1 className="text-xl font-bold">Belanja</h1>
                <p className="text-sm text-base-content/60">
                    {filteredItems.length} barang tersedia
                </p>
            </div>

            <div className="w-full max-w-md mt-4">
                <Autocomplete
                    options={dataAwal}
                    placeholder="Ketik nama atau barcode item..."
                    selectedValue={keyword}
                    keepSelected
                    valueKey="barcode"
                    labelKey="nama"
                    onSelect={(selected) => setKeyword(selected.nama)}
                    onQueryChange={setKeyword}
                />
            </div>

            {filteredItems.length === 0 ? (
                <div className="mt-16 flex flex-col items-center gap-2 text-base-content/50">
                    <PackageSearch size={40} />
                    <p className="text-sm">Barang tidak ditemukan</p>
                </div>
            ) : (
                <div className={cn(
                    "grid grid-cols-2 gap-3 mt-5 pb-24",
                    "md:grid-cols-3",
                    "lg:grid-cols-4 lg:gap-5"
                )}>
                    {filteredItems.map((item) => {
                        const stok = Number(item.stok);
                        const harga = Number(item.hargaJual ?? 0);
                        const stokRendah = stok <= Number(item.stokMinimal ?? 0);

                        return (
                            <div
                                key={item.kode}
                                className={cn(
                                    "flex flex-col overflow-hidden rounded-2xl",
                                    "border border-base-300 bg-base-100 shadow-sm",
                                    "transition hover:-translate-y-0.5 hover:shadow-lg"
                                )}
                            >
                                <div className="relative flex h-24 items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                    <Package size={34} className="text-primary/60" />
                                    <span
                                        className={cn(
                                            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                                            stokRendah
                                                ? "bg-warning text-warning-content"
                                                : "bg-success/15 text-success"
                                        )}
                                    >
                                        Stok {stok.toLocaleString("id-ID")}
                                    </span>
                                </div>

                                <div className="flex flex-1 flex-col gap-1 p-3 text-sm">
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-base-content/50">
                                        {item.jenis}
                                    </span>
                                    <div className="line-clamp-2 min-h-[2.5em] font-medium">
                                        {item.nama}
                                    </div>
                                    <div className="mt-1 flex items-baseline gap-1">
                                        <span className="text-lg font-bold text-primary">
                                            Rp {harga.toLocaleString("id-ID")}
                                        </span>
                                        <span className="text-xs text-base-content/50">
                                            / {item.satuan}
                                        </span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="mt-auto w-full flex gap-2"
                                        // disabled={harga <= 0}
                                        disabled
                                        onClick={() => handleCart(item)}
                                    >
                                        <ShoppingCart size={18} /> Keranjang
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
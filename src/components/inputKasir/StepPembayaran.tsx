"use client";

import { useKasirStore } from "@/src/store/useKasirStore";
import { addTransaksiKasir, editTransaksiKasir } from "@/src/features/penjualan/action";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KasirPayload, EditKasirPayload } from "@/src/types/penjualan";
import { StrukData } from "@/src/types/struk";
import { Button } from "../ui/Button";
import { useToast } from "@/src/context/ToastContext";

interface StepPembayaranProps {
    initialUser: { nama: string } | null;
}

const METODE_LABEL: Record<string, string> = {
    "1": "Tunai (Cash)",
    "2": "Kredit",
    "3": "QRIS / E-Wallet",
};

export function StepPembayaran({ initialUser }: StepPembayaranProps) {
    const { 
        listPelanggan, 
        listBarang, 
        metode, 
        setMetode, 
        total, 
        dateKasir, 
        // user, 
        prevStep, 
        resetKasir 
    } = useKasirStore();

    const [isPending, startTransition] = useTransition();
    // buat nentuin tombol mana yang lagi loading (Simpan vs Simpan & Cetak)
    const [aksiAktif, setAksiAktif] = useState<"simpan" | "cetak" | null>(null);
    const { showToast } = useToast();
    
    const searchParams = useSearchParams();
    const idTransaksiEdit = searchParams.get("id"); 
    const isEditMode = !!idTransaksiEdit;
    const router = useRouter();

    useEffect(() => {
        if (!metode) {
            setMetode("2");
        }
    }, [metode, setMetode]);

    const bukaHalamanStruk = () => {
        const strukData: StrukData = {
            tanggal: dateKasir ? new Date(dateKasir).toISOString() : new Date().toISOString(),
            pelanggan: listPelanggan?.namaPelanggan ?? "-",
            kasir: initialUser?.nama ?? "-",
            metode: METODE_LABEL[metode] ?? "-",
            items: listBarang.map((item) => ({
                namaItem: item.namaItem,
                jumlah: item.jumlah,
                harga: item.harga,
            })),
            total: total ?? 0,
        };

        sessionStorage.setItem("struk-data", JSON.stringify(strukData));

        const jendelaBaru = window.open("/struk", "_blank");
        if (!jendelaBaru) {
            showToast("Popup diblokir browser, izinkan popup untuk mencetak.", "error");
        }
    };

    const handleBayar = async (cetak: boolean) => {
        if (!listPelanggan || !listPelanggan.kodePelanggan || !listPelanggan.namaPelanggan) {
            showToast("Pelanggan belum dipilih", "error");
            return;
        }

        if (!metode) {
            showToast("Metode belum dipilih", "error");
            return;
        }

        const dataKasir = listBarang.map(item => ({
            barcode: item.barcode,
            kodeItem: item.kodeItem,
            namaItem: item.namaItem,
            jenis: item.jenis,
            jumlah: item.jumlah,
            satuan: item.satuan,
            harga: item.harga,
        }));

        const dataPelanggan = {
            kodePelanggan: listPelanggan.kodePelanggan,
            namaPelanggan: listPelanggan.namaPelanggan,
        };

        const basePayload = {
            userBuat: initialUser?.nama || "Kasir System",
            total: total,
            metode: Number(metode),
            startDate: dateKasir,
            dataKasir,
            dataPelanggan,
        };

        setAksiAktif(cetak ? "cetak" : "simpan");

        startTransition(async () => {
            let result;

            if (isEditMode && idTransaksiEdit) {
                const editPayload: EditKasirPayload = {
                    ...basePayload,
                    idTransaksi: idTransaksiEdit
                };
                result = await editTransaksiKasir(editPayload);
            } else {
                const addPayload: KasirPayload = basePayload;
                result = await addTransaksiKasir(addPayload);
            }

            if (result.error) {
                showToast(result.error, "error");
            } else if (result.success) {
                showToast(typeof result.success === "string" ? result.success : "Transaksi berhasil disimpan.", "success");

                if (cetak) {
                    bukaHalamanStruk();
                }

                resetKasir();
                router.push("/inputKasir");
            }

            setAksiAktif(null);
        });
    };

    return (
        <div className="p-6 border border-base-300 rounded-xl bg-base-100 space-y-4 max-w-xl mx-auto">
            <div>
                <h3 className="text-lg font-bold">
                    {isEditMode ? "Konfirmasi Perubahan" : "Metode Pembayaran Kasir"}
                </h3>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-500">Pilih Metode Pembayaran</label>
                <select 
                    value={metode}
                    onChange={(e) => setMetode(e.target.value)}
                    className="border border-base-300 p-2.5 rounded-lg w-full bg-base-100 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={isPending}
                >
                    <option value="1">Tunai (Cash)</option>
                    <option value="2">Kredit</option>
                    <option value="3">QRIS / E-Wallet</option>
                </select>
            </div>

            <div className="p-4 bg-base-100 border border-base-300 rounded-lg text-sm space-y-2">
                <p className="font-bold border-b border-base-300 pb-3 mb-3 text-xs uppercase tracking-wider">
                    Detail Transaksi
                </p>
                <div className="flex justify-between"><span className="text-gray-500">Pelanggan:</span> <span className="font-medium ml-5">{listPelanggan?.namaPelanggan}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Petugas Kasir:</span> <span className="font-medium ml-5">{initialUser?.nama || "-"}</span></div>
                <div className="flex justify-between border-t border-base-300 pt-3 mt-3 font-bold">
                    <span className="">Total Tagihan:</span>
                    <span className="text-blue-600 text-base ml-5">Rp {total?.toLocaleString()}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                <Button 
                    variant="ghost"
                    onClick={prevStep}
                    disabled={isPending}
                >
                    Kembali
                </Button>

                <div className="flex gap-3 w-full sm:w-auto">
                    <Button 
                        variant="ghost"
                        onClick={() => handleBayar(false)}
                        isLoading={isPending && aksiAktif === "simpan"}
                        disabled={isPending || listBarang.length === 0}
                        className="w-full disabled:bg-gray-300"
                    >
                        {isPending && aksiAktif === "simpan" ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button 
                        variant="primary"
                        onClick={() => handleBayar(true)}
                        isLoading={isPending && aksiAktif === "cetak"}
                        disabled={isPending || listBarang.length === 0}
                        className="w-full min-w-[150px] disabled:bg-gray-300"
                    >
                        {isPending && aksiAktif === "cetak" ? "Memproses..." : "Simpan & Cetak"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useKasirStore } from "@/src/store/useKasirStore";
import { addTransaksiKasir, editTransaksiKasir } from "@/src/features/penjualan/action";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KasirPayload, EditKasirPayload } from "@/src/types/penjualan";
import { Button } from "../ui/Button";

interface StepPembayaranProps {
    initialUser: { nama: string } | null;
}

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
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const searchParams = useSearchParams();
    const idTransaksiEdit = searchParams.get("id"); 
    const isEditMode = !!idTransaksiEdit;
    const router = useRouter();

    const showAlert = (msg: string) => alert(msg);

    useEffect(() => {
        if (!metode) {
            setMetode("2");
        }
    }, [metode, setMetode]);

    const handleBayar = async () => {
        if (!listPelanggan || !listPelanggan.kodePelanggan || !listPelanggan.namaPelanggan) {
            showAlert("Pelanggan belum dipilih");
            return;
        }

        if (!metode) {
            showAlert("Metode belum dipilih");
            return;
        }

        const dataKasir = listBarang.map(item => ({
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

        setErrorMessage(null);

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
                setErrorMessage(result.error);
            } else if (result.success) {
                showAlert(result.success);
                resetKasir();
                router.push("/inputKasir");
            }
        });
    };

    return (
        <div className="p-6 border border-base-300 rounded-xl bg-base-100 space-y-4 max-w-xl mx-auto">
            <div>
                <h3 className="text-lg font-bold">
                    {isEditMode ? "Konfirmasi Perubahan" : "Metode Pembayaran Kasir"}
                </h3>
            </div>

            {errorMessage && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    ⚠️ {errorMessage}
                </div>
            )}

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

            <div className="flex justify-between gap-3 pt-2">
                <Button 
                    variant="ghost"
                    onClick={prevStep}
                    disabled={isPending}
                >
                    Kembali
                </Button>
                <Button 
                    variant="primary"
                    onClick={handleBayar}
                    isLoading={isPending}
                    disabled={isPending || listBarang.length === 0}
                    className="w-full disabled:bg-gray-300"
                >
                    {isPending ? "Memproses Data..." : isEditMode ? "Update Perubahan" : "Proses Pembayaran"}
                </Button>
            </div>
        </div>
    );
}
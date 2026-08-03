"use client";

import { useKasirStore } from "@/src/store/useKasirStore";
import { addTransaksiKasir, editTransaksiKasir } from "@/src/features/penjualan/action";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { KasirPayload, EditKasirPayload } from "@/src/types/penjualan";
import { Button } from "../ui/Button";
import { useToast } from "@/src/context/ToastContext";
import { usePembelianStore } from "@/src/store/usePembelianStore";
import { addTransaksiPembelian, editTransaksiPembelian } from "@/src/features/pembelian/action";
import { EditPembelianPayload, PembelianPayload } from "@/src/types/pembelian";

interface StepPembayaranProps {
    initialUser: { nama: string } | null;
}

export function StepPembayaran({ initialUser }: StepPembayaranProps) {
    const { 
        listSupplier, 
        listBarang, 
        metode,
        setMetode,
        total, 
        datePembelian, 
        // user, 
        prevStep, 
        resetPembelian
    } = usePembelianStore(); 

    const [isPending, startTransition] = useTransition();
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

    const handleBeli = async () => {
        if (!listSupplier || !listSupplier.kodeSupplier || !listSupplier.namaSupplier) {
            showToast("Supplier belum dipilih", "error");
            return;
        }

        const dataPembelian = listBarang.map(item => ({
            barcode: item.barcode,
            kodeItem: item.kodeItem,
            namaItem: item.namaItem,
            jenis: item.jenis,
            jumlah: item.jumlah,
            satuan: item.satuan,
            harga: item.harga,
            expiredDate: item.expireDate
        }));

        const dataSupplier = {
            kodeSupplier: listSupplier.kodeSupplier,
            namaSupplier: listSupplier.namaSupplier,
        };

        const basePayload = {
            userBuat: initialUser?.nama || "Kasir System",
            total: total,
            metode: Number(metode),
            startDate: datePembelian,
            dataPembelian,
            dataSupplier,
        };

        startTransition(async () => {
            let result;

            if (isEditMode && idTransaksiEdit) {
                const editPayload: EditPembelianPayload = {
                    ...basePayload,
                    idTransaksi: idTransaksiEdit
                };
                result = await editTransaksiPembelian(editPayload);
            } else {
                const addPayload: PembelianPayload = basePayload;
                result = await addTransaksiPembelian(addPayload);
            }

            if (result.error) {
                showToast(result.error, "error");
            } else if (result.success) {
                showToast(typeof result.success === "string" ? result.success : "Transaksi berhasil disimpan.", "success");
                resetPembelian();
                router.push("/daftarPembelian");
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

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-500">Pilih Metode Pembayaran</label>
                <select 
                    value={metode}
                    onChange={(e) => setMetode(e.target.value)}
                    className="border border-base-300 p-2.5 rounded-lg w-full bg-base-100 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                    disabled={isPending}
                >
                    <option value="1">Tunai (Cash)</option>
                    <option value="2">Transfer</option>
                </select>
            </div>

            <div className="p-4 bg-base-100 border border-base-300 rounded-lg text-sm space-y-2">
                <p className="font-bold border-b border-base-300 pb-3 mb-3 text-xs uppercase tracking-wider">
                    Detail Transaksi
                </p>
                <div className="flex justify-between"><span className="text-gray-500">Pelanggan:</span> <span className="font-medium ml-5">{listSupplier?.namaSupplier}</span></div>
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
                    onClick={handleBeli}
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
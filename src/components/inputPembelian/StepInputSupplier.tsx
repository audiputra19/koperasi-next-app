"use client";

import { usePembelianStore } from "@/src/store/usePembelianStore";
import { DaftarSupplier } from "@/src/types/menu";
import { Button } from "../ui/Button";
import { Autocomplete } from "../ui/AutoComplete";
import { SessionPayload } from "@/src/types/auth";
import moment from "moment-timezone";

interface StepInputSupplierProps {
    dataSupplier: DaftarSupplier[];
    session: SessionPayload | null;
}

export function StepInputSupplier({ dataSupplier, session }: StepInputSupplierProps) {
    const { listSupplier, setListSupplier, nextStep, datePembelian, setDatePembelian } = usePembelianStore();
    const tanggalValue = moment(datePembelian).tz("Asia/Jakarta").format("YYYY-MM-DD");
    const isAdmin = session?.role === "Admin";

    return (
        <div className="p-6 border border-base-300 rounded-lg bg-base-100 space-y-4 max-w-md mx-auto">
            <div>
                <h3 className="text-lg font-bold">Pilih Supplier</h3>
            </div>

            {(isAdmin) && (
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-500">Tanggal Transaksi</label>
                <input
                    type="date"
                    className="input input-bordered w-full"
                    value={tanggalValue}
                    onChange={(e) => {
                        if (!e.target.value) return;
                        // pertahankan jam saat ini, hanya ganti tanggalnya
                        const jamSekarang = moment(datePembelian).tz("Asia/Jakarta").format("HH:mm:ss");
                        const tanggalBaru = `${e.target.value} ${jamSekarang}`;
                        setDatePembelian(tanggalBaru);
                    }}
                />
            </div>
            )}

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-500">Cari Supplier</label>
                <Autocomplete
                    options={dataSupplier}
                    placeholder="Ketik nama atau kode Supplier..."
                    selectedValue={""}
                    valueKey="kode"
                    labelKey="nama"
                    onSelect={(Supplier) => {
                        setListSupplier({
                            kodeSupplier: Supplier.kode,
                            namaSupplier: Supplier.nama
                        });
                    }}
                />
            </div>

            {listSupplier?.kodeSupplier && (
                <div className="p-2.5 bg-base-100 border border-base-300 rounded-lg text-xs text-blue-700">
                    Terpilih: <span className="font-semibold">{listSupplier.namaSupplier}</span> ({listSupplier.kodeSupplier})
                </div>
            )}
            <Button
                variant="primary"
                onClick={nextStep}
                disabled={!listSupplier?.kodeSupplier}
                className="w-full disabled:bg-gray-300"
            >
                Lanjut ke Input Barang
            </Button>
        </div>
    );
}
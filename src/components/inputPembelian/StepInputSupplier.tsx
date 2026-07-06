"use client";

import { usePembelianStore } from "@/src/store/usePembelianStore";
import { DaftarSupplier } from "@/src/types/menu";
import { Autocomplete } from "../common/AutoComplete";
import { Button } from "../ui/Button";

interface StepInputSupplierProps {
    dataSupplier: DaftarSupplier[];
}

export function StepInputSupplier({ dataSupplier }: StepInputSupplierProps) {
    const { listSupplier, setListSupplier, nextStep } = usePembelianStore();

    return (
        <div className="p-6 border border-base-300 rounded-lg bg-base-100 space-y-4 max-w-md mx-auto">
            <div>
                <h3 className="text-lg font-bold">Pilih Supplier</h3>
            </div>

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
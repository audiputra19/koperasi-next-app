"use client";

import { useKasirStore } from "@/src/store/useKasirStore";
import { DaftarPelanggan } from "@/src/types/menu";
import { Button } from "../ui/Button";
import { Autocomplete } from "../ui/AutoComplete";
import moment from "moment-timezone";

interface StepInputPelangganProps {
    dataPelanggan: DaftarPelanggan[];
}

export function StepInputPelanggan({ dataPelanggan }: StepInputPelangganProps) {
    const { listPelanggan, setListPelanggan, nextStep, dateKasir, setDateKasir } = useKasirStore();

    const tanggalValue = moment(dateKasir).tz("Asia/Jakarta").format("YYYY-MM-DD");

    return (
        <div className="p-6 border border-base-300 rounded-lg bg-base-100 space-y-4 max-w-md mx-auto">
            <div>
                <h3 className="text-lg font-bold">Pilih Pelanggan</h3>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-500">Tanggal Transaksi</label>
                <input
                    type="date"
                    className="input input-bordered w-full"
                    value={tanggalValue}
                    onChange={(e) => {
                        if (!e.target.value) return;
                        // pertahankan jam saat ini, hanya ganti tanggalnya
                        const jamSekarang = moment(dateKasir).format("HH:mm:ss");
                        const tanggalBaru = `${e.target.value} ${jamSekarang}`;
                        setDateKasir(tanggalBaru);
                    }}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-500">Cari Pelanggan</label>
                <Autocomplete
                    options={dataPelanggan}
                    placeholder="Ketik nama atau kode pelanggan..."
                    selectedValue={""}
                    valueKey="kode"
                    labelKey="nama"
                    onSelect={(pelanggan) => {
                        setListPelanggan({
                            kodePelanggan: pelanggan.kode,
                            namaPelanggan: pelanggan.nama,
                            sumberPelanggan: pelanggan.sumber
                        });
                    }}
                />
            </div>

            {listPelanggan?.kodePelanggan && (
                <div className="p-2.5 bg-base-100 border border-base-300 rounded-lg text-xs text-blue-700">
                    Terpilih: <span className="font-semibold">{listPelanggan.namaPelanggan}</span> ({listPelanggan.kodePelanggan})
                </div>
            )}
            <Button
                variant="primary"
                onClick={nextStep}
                disabled={!listPelanggan?.kodePelanggan}
                className="w-full disabled:bg-gray-300"
            >
                Lanjut ke Input Barang
            </Button>
        </div>
    );
}
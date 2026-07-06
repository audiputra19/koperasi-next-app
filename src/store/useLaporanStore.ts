import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DataPelanggan } from "../types/penjualan";

interface LaporanState {
    startDate: string;
    endDate: string;
    listPelanggan: DataPelanggan | null;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    setListPelanggan: (pelanggan: DataPelanggan) => void;
}

export const useLaporanStore = create<LaporanState>()(
    persist (
        (set) => ({
            startDate: "",
            endDate: "",
            listPelanggan: null,
            setStartDate: (date) => set({ startDate: date }),
            setEndDate: (date) => set({ endDate: date }),
            setListPelanggan: (pelanggan) => set({ listPelanggan: pelanggan })
        }),
        {
            name: "koperasi-laporan-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
 

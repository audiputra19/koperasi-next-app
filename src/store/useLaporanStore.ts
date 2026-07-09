import { create } from "zustand";
import { DataPelanggan } from "../types/penjualan";

interface LaporanState {
    startDate: string;
    endDate: string;
    listPelanggan: DataPelanggan | null;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
    setListPelanggan: (pelanggan: DataPelanggan) => void;
    resetLaporan: () => void;
}

export const useLaporanStore = create<LaporanState>((set) => ({
    startDate: "",
    endDate: "",
    listPelanggan: null,
    setStartDate: (date) => set({ startDate: date }),
    setEndDate: (date) => set({ endDate: date }),
    setListPelanggan: (pelanggan) => set({ listPelanggan: pelanggan }),
    resetLaporan: () => set({ 
        startDate: "", 
        endDate: "", 
        listPelanggan: null 
    }),
}));

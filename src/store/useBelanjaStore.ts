import { create } from "zustand";
import { DataBelanja, DataPelanggan } from "../types/belanja";
import { createJSONStorage, persist } from "zustand/middleware";
import moment from "moment-timezone";

interface BelanjaState {
    listPelanggan: DataPelanggan | null; 
    listBarang: DataBelanja[];
    dateKasir: string;
    total: number;

    setListPelanggan: (pelanggan: DataPelanggan) => void;
    addBarang: (barangBaru: Omit<DataBelanja, "jumlah">) => void; 
    updateQtyBarang: (kodeItem: string, jumlahBaru: number) => void;
    removeBarang: (kodeItem: string) => void;
}

export const useBelanjaStore = create<BelanjaState>() (
    persist(
        (set) => ({
            listPelanggan: null,
            listBarang: [],
            total: 0,
            dateKasir: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),

            setListPelanggan: (pelanggan) => set({ listPelanggan: pelanggan }),

            addBarang: (barangBaru) => set((state) => {
                const exists = state.listBarang.find((b) => b.kodeItem === barangBaru.kodeItem);
                let updatedList;
                
                if (exists) {
                    updatedList = state.listBarang.map((b) => 
                        b.kodeItem === barangBaru.kodeItem ? { ...b, jumlah: b.jumlah + 1 } : b
                    );
                } else {
                    updatedList = [...state.listBarang, { ...barangBaru, jumlah: 1 }];
                }

                const newTotal = updatedList.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
                return { listBarang: updatedList, total: newTotal };
            }),

            updateQtyBarang: (kodeItem, jumlahBaru) => set((state) => {
                const updatedList = state.listBarang.map((b) => 
                    b.kodeItem === kodeItem ? { ...b, jumlah: Math.max(1, jumlahBaru) } : b
                );
                const newTotal = updatedList.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
                return { listBarang: updatedList, total: newTotal };
            }),

            removeBarang: (kodeItem) => set((state) => {
                const updatedList = state.listBarang.filter((b) => b.kodeItem !== kodeItem);
                const newTotal = updatedList.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
                return { listBarang: updatedList, total: newTotal };
            }),
        }),
        {
            name: "koperasi-belanja-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
)
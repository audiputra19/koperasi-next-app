import { create } from "zustand";
import { DataKasir, DataPelanggan } from "../types/penjualan";
import { createJSONStorage, persist } from "zustand/middleware";
import moment from "moment-timezone";

interface KasirState {
    step: number;
    listPelanggan: DataPelanggan | null; 
    listBarang: DataKasir[];             
    metode: string;                      
    total: number;                       
    dateKasir: string;                   
    user: { nama: string } | null;       
    
    // Actions Utama
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    
    // Actions Manipulasi Data
    setListPelanggan: (pelanggan: DataPelanggan) => void;
    addBarang: (barangBaru: Omit<DataKasir, "jumlah">) => void; 
    updateQtyBarang: (kodeItem: string, jumlahBaru: number) => void;
    removeBarang: (kodeItem: string) => void;
    setMetode: (metodePilihan: string) => void;
    
    // Injector untuk mode EDIT
    setEditContext: (
        dataPelanggan: DataPelanggan,
        metodeLama: string,
        tanggalLama: string
    ) => void;
    setBarangFromEdit: (dataKasir: DataKasir[]) => void;

    setInitialDataForEdit: (
        dataPelanggan: DataPelanggan, 
        dataKasir: DataKasir[], 
        metodeLama: string, 
        tanggalLama: string
    ) => void;
    
    resetKasir: () => void;
}

export const useKasirStore = create<KasirState>()(
    persist(
        (set) => ({
            step: 1,
            listPelanggan: null,
            listBarang: [],
            metode: "",
            total: 0,
            dateKasir: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            user: { nama: "Kasir Admin" },

            nextStep: () => set((state) => ({ step: state.step + 1 })),
            prevStep: () => set((state) => ({ step: state.step - 1 })),
            setStep: (targetStep) => set({ step: targetStep }),
            
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

            setMetode: (metodePilihan) => set({ metode: metodePilihan }),

            setEditContext: (dataPelanggan, metodeLama, tanggalLama) => {
                set({
                    step: 1,
                    listPelanggan: dataPelanggan,
                    listBarang: [],       // kosongkan dulu, biar tidak nampilin barang transaksi sebelumnya sekilas
                    metode: metodeLama,
                    dateKasir: tanggalLama,
                    total: 0,
                });
            },

            setBarangFromEdit: (dataKasir) => {
                const totalLama = dataKasir.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
                set({
                    listBarang: dataKasir,
                    total: totalLama,
                });
            },

            setInitialDataForEdit: (dataPelanggan, dataKasir, metodeLama, tanggalLama) => {
                const totalLama = dataKasir.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
                set({
                    step: 1,
                    listPelanggan: dataPelanggan,
                    listBarang: dataKasir,
                    metode: metodeLama,
                    dateKasir: tanggalLama,
                    total: totalLama
                });
            },

            resetKasir: () => set({ 
                step: 1, 
                listPelanggan: null, 
                listBarang: [], 
                metode: "", 
                total: 0,
                dateKasir: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
            })
        }),
        {
            name: "koperasi-kasir-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
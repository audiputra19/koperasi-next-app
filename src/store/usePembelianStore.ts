"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DataPembelian, DataSupplier } from "../types/pembelian";
import moment from "moment-timezone";

interface PembelianState {
    step: number;
    listSupplier: DataSupplier | null; 
    listBarang: DataPembelian[];             
    metode: string;                      
    total: number;                       
    datePembelian: string;                   
    user: { nama: string } | null;       
    
    // Actions Utama
    nextStep: () => void;
    prevStep: () => void;
    setStep: (step: number) => void;
    
    // Actions Manipulasi Data
    setListSupplier: (supplier: DataSupplier) => void;
    addBarang: (barangBaru: Omit<DataPembelian, "jumlah">) => void; 
    updateQtyBarang: (kodeItem: string, jumlahBaru: number) => void;
    updateExpireDateBarang: (kodeItem: string, dateBaru: string) => void;
    updateHargaBarang: (kodeItem: string, hargaBaru: number) => void;
    removeBarang: (kodeItem: string) => void;
    setMetode: (metodePilihan: string) => void;
    
    setInitialDataForEdit: (
        dataSupplier: DataSupplier, 
        dataPembelian: DataPembelian[], 
        metodeLama: string, 
        tanggalLama: string
    ) => void;
    resetPembelian: () => void; 
}

export const usePembelianStore = create<PembelianState>()(
    persist(
        (set) => ({
            step: 1,
            listSupplier: null,
            listBarang: [],
            metode: "",
            total: 0,
            user: null,
            datePembelian: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH::mm:ss"),

            nextStep: () => set((state) => ({ step: state.step + 1 })),
            prevStep: () => set((state) => ({ step: state.step - 1 })),
            setStep: (targetStep) => set({ step: targetStep }),
            
            setListSupplier: (supplier) => set({ listSupplier: supplier }),
            
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
            updateExpireDateBarang: (kodeItem, dateBaru) => set((state) => ({
                listBarang: state.listBarang.map((b) => 
                    b.kodeItem === kodeItem ? { ...b, expireDate: dateBaru } : b
                )
            })),
            updateHargaBarang: (kodeItem, hargaBaru) => set((state) => {
                const updatedList = state.listBarang.map((b) => 
                    b.kodeItem === kodeItem ? { ...b, harga: hargaBaru } : b
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

            setInitialDataForEdit: (dataSupplier, dataPembelian, metodeLama, tanggalLama) => {
                const totalLama = dataPembelian.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
                set({
                    step: 1,
                    listSupplier: dataSupplier,
                    listBarang: dataPembelian,
                    metode: metodeLama,
                    datePembelian: tanggalLama,
                    total: totalLama
                });
            },

            resetPembelian: () => set({ 
                step: 1, 
                listSupplier: null, 
                listBarang: [], 
                metode: "", 
                total: 0,
                datePembelian: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss")
            })
        }),
        {
            name: "koperasi-pembelian-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
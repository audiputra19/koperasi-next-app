import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import moment from "moment-timezone";
import { SonItem } from "../types/son";

interface SonState {
    itemList: SonItem[];
    sonDate: string;

    // Actions
    addItem: (newItem: Omit<SonItem, "physicalStock"> & { physicalStock?: number }) => void;
    updatePhysicalStock: (itemCode: string, newStock: number) => void;
    removeItem: (itemCode: string) => void;
    setSonDate: (date: string) => void;
    resetSon: () => void;
}

export const useSonStore = create<SonState>()(
    persist(
        (set) => ({
            itemList: [],
            sonDate: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),

            addItem: (newItem) => set((state) => {
                const exists = state.itemList.find((item) => item.itemCode === newItem.itemCode);
                // Kalau item sudah ada di list, tidak usah ditambah dobel
                if (exists) return state;

                const item: SonItem = {
                    ...newItem,
                    // default physicalStock = systemStock, biar user tinggal koreksi kalau beda
                    physicalStock: newItem.physicalStock ?? newItem.systemStock,
                };

                return { itemList: [item, ...state.itemList] };
            }),

            updatePhysicalStock: (itemCode, newStock) => set((state) => ({
                itemList: state.itemList.map((item) =>
                    item.itemCode === itemCode ? { ...item, physicalStock: Math.max(0, newStock) } : item
                ),
            })),

            removeItem: (itemCode) => set((state) => ({
                itemList: state.itemList.filter((item) => item.itemCode !== itemCode),
            })),

            setSonDate: (date) => set({
                sonDate: moment.tz(date, "Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            }),

            resetSon: () => set({
                itemList: [],
                sonDate: moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss"),
            }),
        }),
        {
            name: "koperasi-son-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
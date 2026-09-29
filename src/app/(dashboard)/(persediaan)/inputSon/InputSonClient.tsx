"use client";

import { Autocomplete } from "@/src/components/ui/AutoComplete";
import { Button } from "@/src/components/ui/Button";
import { addSon, editSon } from "@/src/features/persediaan/action";
import { SonService } from "@/src/features/persediaan/persediaan.service";
import { cn } from "@/src/lib/cn";
import { useSonStore } from "@/src/store/useSonStore";
import { SessionPayload } from "@/src/types/auth";
import { DaftarItem } from "@/src/types/menu";
import { Minus, Plus, Save, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface InputSonClientProps {
    itemData: DaftarItem[];
    session: SessionPayload | null;
}

export function InputSonClient({ itemData, session }: InputSonClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("id"); // ada = mode edit
    const isEditMode = !!editId;

    const { itemList, addItem, updatePhysicalStock, removeItem, resetSon } = useSonStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditMode);

    // Mode edit: ambil detail SON lalu isi ke store
    useEffect(() => {
        if (!editId) return;

        let cancelled = false;

        const loadSon = async () => {
            try {
                setIsLoading(true);
                const detail = await SonService.getDaftarSonDetail(editId);

                if (cancelled) return;

                resetSon();

                (detail ?? []).forEach((d: {
                    itemCode: string;
                    itemName: string;
                    systemStock: number;
                    physicalStock: number;
                }) => {
                    // Lengkapi barcode/satuan/jenis dari daftar item
                    const master = itemData.find((i) => i.kode === d.itemCode);

                    addItem({
                        barcode: master?.barcode ?? "",
                        itemCode: d.itemCode,
                        itemName: d.itemName,
                        unit: master?.satuan ?? "",
                        category: master?.jenis,
                        systemStock: Number(d.systemStock),
                        physicalStock: Number(d.physicalStock),
                    });
                });
            } catch (error) {
                console.error("Gagal memuat data SON:", error);
                alert("Gagal memuat data SON.");
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadSon();

        return () => {
            cancelled = true;
            resetSon(); // bersihkan store saat keluar dari mode edit
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editId]);

    const handleSelectItem = (selectedItem: DaftarItem) => {
        addItem({
            barcode: selectedItem.barcode,
            itemCode: selectedItem.kode,
            itemName: selectedItem.nama,
            unit: selectedItem.satuan,
            category: selectedItem.jenis,
            systemStock: selectedItem.stok,
            physicalStock: selectedItem.stok,
        });
    };

    const handleSave = async () => {
        if (itemList.length === 0) {
            alert("Belum ada item yang diinput.");
            return;
        }

        const confirmed = window.confirm(
            isEditMode
                ? `Perubahan SON ${editId} akan disimpan untuk ${itemList.length} item.\nLanjutkan simpan?`
                : `Stock Opname akan diterapkan untuk ${itemList.length} item yang diinput.\nLanjutkan simpan?`
        );
        if (!confirmed) return;

        try {
            setIsSaving(true);

            const result = isEditMode
                ? await editSon({
                    sonNumber: editId!,
                    updatedBy: session?.nama,
                    items: itemList,
                })
                : await addSon({
                    date: new Date().toISOString(),
                    createdBy: session?.nama,
                    items: itemList,
                });

            if (result.error) {
                alert(result.error);
                return;
            }

            alert(result.success || "Data SON berhasil disimpan.");
            resetSon();
            router.push("/daftarSon");
        } catch (error) {
            console.error("Gagal menyimpan data SON:", error);
            alert("Terjadi kesalahan saat menyimpan data SON.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={cn("w-full max-w-[1000px] mx-auto space-y-5 md:px-0")}>
            <div className="bg-base-100 border border-base-300 rounded-xl p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-bold">
                        {isEditMode ? "Edit Stock Opname" : "Input Stock Opname"}
                    </h3>
                    {isEditMode && (
                        <p className="text-sm text-gray-500 font-mono">{editId}</p>
                    )}
                </div>

                {/* Bagian Autocomplete pencarian barang */}
                <div className="w-full max-w-md">
                    <label className="text-sm font-medium text-gray-500 block mb-1">Cari Item</label>
                    <Autocomplete
                        options={itemData}
                        placeholder="Ketik nama atau barcode item..."
                        selectedValue=""
                        valueKey="barcode"
                        labelKey="nama"
                        onSelect={handleSelectItem}
                    />
                </div>

                <div className="border border-base-300 rounded-lg overflow-x-auto w-full">
                    <table className="w-full text-center text-sm">
                        <thead>
                            <tr className="bg-base-200 font-semibold border-b border-base-300">
                                <th className="p-3">Kode</th>
                                <th className="p-3">Nama Item</th>
                                <th className="p-3">Satuan</th>
                                <th className="p-3">Stok Sistem</th>
                                <th className="p-3">Stok Fisik</th>
                                <th className="p-3">Selisih</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-300">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400">
                                        <span className="loading loading-spinner loading-sm" />
                                    </td>
                                </tr>
                            ) : itemList.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                                        Belum ada item yang diinput.
                                    </td>
                                </tr>
                            ) : (
                                itemList.map((item) => {
                                    const difference = item.physicalStock - item.systemStock;
                                    return (
                                        <tr key={item.itemCode} className="hover:bg-base-200">
                                            <td className="p-3 font-mono text-xs min-w-[100px]">{item.barcode}</td>
                                            <td className="p-3 text-start font-medium min-w-[200px]">{item.itemName}</td>
                                            <td className="p-3 min-w-[80px]">{item.unit}</td>
                                            <td className="p-3 min-w-[100px]">{item.systemStock}</td>

                                            {/* Edit Stok Fisik */}
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <button
                                                        onClick={() => updatePhysicalStock(item.itemCode, item.physicalStock - 1)}
                                                        className={cn(
                                                            "flex justify-center items-center border border-base-300",
                                                            "w-6 h-6 bg-base-100 rounded-full cursor-pointer",
                                                            "hover:bg-base-300"
                                                        )}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={item.physicalStock}
                                                        onChange={(e) =>
                                                            updatePhysicalStock(item.itemCode, parseInt(e.target.value) || 0)
                                                        }
                                                        className={cn(
                                                            "w-16 h-6 text-center border border-base-300 rounded p-0.5 text-xs",
                                                            "font-semibold bg-base-100"
                                                        )}
                                                        min="0"
                                                    />
                                                    <button
                                                        onClick={() => updatePhysicalStock(item.itemCode, item.physicalStock + 1)}
                                                        className={cn(
                                                            "flex justify-center items-center border border-base-300",
                                                            "w-6 h-6 bg-base-100 rounded-full cursor-pointer",
                                                            "hover:bg-base-300"
                                                        )}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className={cn(
                                                "p-3 font-semibold min-w-[80px]",
                                                difference > 0 && "text-green-600",
                                                difference < 0 && "text-red-600",
                                                difference === 0 && "text-gray-400"
                                            )}>
                                                {difference > 0 ? `+${difference}` : difference}
                                            </td>

                                            <td className="p-3 text-center">
                                                <div className="tooltip" data-tip="Hapus">
                                                    <button
                                                        onClick={() => removeItem(item.itemCode)}
                                                        className={cn(
                                                            "rounded p-1.5 cursor-pointer",
                                                            "hover:bg-base-300"
                                                        )}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Navigasi & Ringkasan */}
                <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-base-300 gap-4">
                    <div className="text-center sm:text-left">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                            Total Item
                        </span>
                        <span className="text-2xl font-bold text-blue-600">{itemList.length}</span>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            onClick={resetSon}
                            disabled={isSaving || isLoading || itemList.length === 0}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSave}
                            disabled={isSaving || isLoading || itemList.length === 0}
                            className="flex gap-2 disabled:bg-gray-300"
                        >
                            <Save size={18} />
                            {isSaving ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan SON"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
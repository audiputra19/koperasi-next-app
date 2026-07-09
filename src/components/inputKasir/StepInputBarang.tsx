"use client";

import { cn } from "@/src/lib/cn";
import { useKasirStore } from "@/src/store/useKasirStore";
import { DaftarItem } from "@/src/types/menu";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Autocomplete } from "../ui/AutoComplete";

interface StepInputItemProps {
    dataItem: DaftarItem[];
}

export function StepInputBarang({ dataItem }: StepInputItemProps) {
    const { listBarang, addBarang, updateQtyBarang, removeBarang, nextStep, prevStep } = useKasirStore();   

    const handleSelectBarang = (selected: DaftarItem) => {
        addBarang({
            kodeItem: selected.kode,
            namaItem: selected.nama,
            jenis: selected.jenis,
            satuan: selected.satuan,
            harga: selected.hargaJual,
        });
    };

    // const totalHarga = listBarang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    const totalHarga = useKasirStore((state) => state.total);

    return (
        <div className="p-6 border border-base-300 rounded-xl bg-base-100 space-y-4 mx-auto">
            <div>
                <h3 className="text-lg font-bold">Input Item Belanja</h3>
            </div>

            {/* Bagian Autocomplete pencarian barang */}
            <div className="w-full max-w-md">
                <label className="text-sm font-medium text-gray-500 block mb-1">Cari Item</label>
                <Autocomplete
                    options={dataItem}
                    placeholder="Ketik nama atau barcode item..."
                    selectedValue=""
                    valueKey="barcode"
                    labelKey="nama"
                    onSelect={handleSelectBarang}
                />
            </div>

            <div className="border border-base-300 rounded-lg overflow-x-auto w-full">
                <table className="w-full text-center text-sm">
                    <thead>
                        <tr className="bg-base-200 font-semibold border-b border-base-300">
                            <th className="p-3">Kode</th>
                            <th className="p-3">Nama Item</th>
                            <th className="p-3">Harga</th>
                            <th className="p-3">Jumlah</th>
                            <th className="p-3">Subtotal</th>
                            <th className="p-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base-300">
                        {listBarang.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400 italic">
                                    Belum ada item belanja.
                                </td>
                            </tr>
                        ) : (
                            listBarang.map((item) => (
                                <tr key={item.kodeItem} className="hover:bg-base-200">
                                    <td className="p-3 font-mono text-xs min-w-[100px]">{item.kodeItem}</td>
                                    <td className="p-3 font-medium min-w-[200px]">{item.namaItem}</td>
                                    <td className="p-3 text-right min-w-[100px]">Rp {item.harga.toLocaleString()}</td>
                                    
                                    {/* Edit Kuantitas/Jumlah */}
                                    <td className="p-3 text-center">
                                        <div className="flex items-center justify-center gap-1.5">
                                            <button 
                                                onClick={() => updateQtyBarang(item.kodeItem, item.jumlah - 1)}
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
                                                value={item.jumlah}
                                                onChange={(e) => updateQtyBarang(item.kodeItem, parseInt(e.target.value) || 1)}
                                                className={cn(
                                                    "w-15 h-6 text-center border border-base-300 rounded p-0.5 text-xs",
                                                    "font-semibold bg-base-100"
                                                )}
                                                min="1"
                                            />
                                            <button 
                                                onClick={() => updateQtyBarang(item.kodeItem, item.jumlah + 1)}
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
                                    <td className="p-3 text-right font-semibold min-w-[130px]">
                                        Rp {(item.harga * item.jumlah).toLocaleString()}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="tooltip" data-tip="Hapus">
                                            <button 
                                                onClick={() => removeBarang(item.kodeItem)}
                                                className={cn(
                                                    "rounded p-1.5 cursor-pointer",
                                                    "hover:bg-base-300"
                                                )}
                                            >
                                                <Trash2 size={18}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Navigasi & Total Finansial */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-5 border-t border-base-300 gap-4">
                <div className="text-center sm:text-left">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Total Tagihan</span>
                    <span className="text-2xl font-bold text-blue-600">Rp {totalHarga.toLocaleString()}</span>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                    >
                        Kembali
                    </Button>
                    <Button 
                        variant="primary"
                        onClick={nextStep} 
                        disabled={listBarang.length === 0}
                        className= "disabled:bg-gray-300"
                    >
                        Lanjut ke Pembayaran
                    </Button>
                </div>
            </div>
        </div>
    );
}
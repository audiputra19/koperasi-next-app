'use client';

import { Button } from '@/src/components/ui/Button';
import { addHargaItem } from '@/src/features/pembelian/action';
import { usePembelianStore } from '@/src/store/usePembelianStore';
import { DaftarItem, MenuState } from '@/src/types/menu';
import { HargaItem } from '@/src/types/pembelian';
import { useActionState, useEffect, useState } from 'react';

interface FormInputHargaProps {
    onClose: () => void;
    initialData: DaftarItem | null;
    hargaItem: HargaItem[];
}

export default function FormInputHarga({ onClose, initialData, hargaItem }: FormInputHargaProps) {
    const initialState: MenuState = {};
    const [state, formAction, isPending] = useActionState(addHargaItem, initialState);
    const updateHargaBarang = usePembelianStore((state) => state.updateHargaBarang);

    // Set default value dari initialData jika ada
    const [hargaBeli, setHargaBeli] = useState<number | ''>('');
    const [hargaJual, setHargaJual] = useState<number | ''>('');
    const [persenUntung, setPersenUntung] = useState<number | ''>('');

    useEffect(() => {
        if (state?.success) {
            if (initialData?.kode && hargaJual !== '') {
                updateHargaBarang(initialData.kode, Number(hargaJual)); 
            }
            
            onClose();
        }
    }, [state, onClose, initialData, hargaJual, updateHargaBarang]);

    const handleHargaBeliChange = (raw: string) => {
        if (raw === '') {
            setHargaBeli('');
            return;
        }
        const val = Number(raw);
        setHargaBeli(val);

        if (persenUntung !== '' && persenUntung > 0) {
            const hasilJual = val + (val * persenUntung) / 100;
            setHargaJual(Math.round(hasilJual));
        } else {
            setHargaJual(val);
        }
    };

    const handlePersenChange = (raw: string) => {
        if (raw === '') {
            setPersenUntung('');
            if (hargaBeli !== '') {
                setHargaJual(hargaBeli);
            }
            return;
        }
        const persen = Number(raw);
        setPersenUntung(persen);

        if (hargaBeli !== '' && hargaBeli > 0) {
            const hasilJual = hargaBeli + (hargaBeli * persen) / 100;
            setHargaJual(Math.round(hasilJual));
        }
    };

    const handleHargaJualChange = (raw: string) => {
        if (raw === '') {
            setHargaJual('');
            return;
        }
        const jual = Number(raw);
        setHargaJual(jual);

        if (hargaBeli !== '' && hargaBeli > 0) {
            const hasilPersen = ((jual - hargaBeli) / hargaBeli) * 100;
            setPersenUntung(Math.round(hasilPersen));
        }
    };

    // Helper formatter mata uang Rupiah
    const formatRupiah = (nominal: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(nominal);
    };

    return (
        <div className="space-y-6">
            {/* FORM INPUT HARGA BARU */}
            <form action={formAction} className="flex flex-col gap-3">
                <input type="hidden" name="kdItem" defaultValue={initialData?.kode} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">Harga Beli Baru</span></label>
                        <input 
                            type="number"
                            name="hargaBeli" 
                            className="input input-bordered w-full bg-base-100 input-md" 
                            placeholder="0" 
                            value={hargaBeli}
                            onChange={(e) => handleHargaBeliChange(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-control w-full">
                        <label className="label py-1">
                            <span className="label-text font-medium text-blue-600 text-sm">Keuntungan (%)</span>
                        </label>
                        <div className="relative flex items-center">
                            <input 
                                type="number"
                                name="persenUntung" 
                                className="input input-bordered w-full bg-base-100 input-md pr-8 font-semibold border-blue-300 focus:border-blue-500" 
                                placeholder="0" 
                                value={persenUntung}
                                onChange={(e) => handlePersenChange(e.target.value)}
                            />
                            <span className="absolute right-3 text-gray-400 font-bold text-sm">%</span>
                        </div>
                    </div>

                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">Harga Jual Baru</span></label>
                        <input 
                            type="number"
                            name="hargaJual" 
                            className="input input-bordered w-full bg-base-100 input-md font-bold" 
                            placeholder="0" 
                            value={hargaJual}
                            onChange={(e) => handleHargaJualChange(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" onClick={onClose} variant="ghost">
                        Batal
                    </Button>
                    <Button variant="primary" isLoading={isPending}>
                        Simpan Data
                    </Button>
                </div>
            </form>

            {/* TABEL HISTORY HARGA PEMBELIAN SEBELUMNYA */}
            <div className="border-t border-base-300 pt-4">
                <h3 className="text-xs font-bold text-gray-600 mb-3 tracking-wide uppercase">
                    Histori Harga Pembelian Terakhir
                </h3>
                
                <div className="overflow-x-auto max-h-[220px] rounded-lg border border-base-200">
                    <table className="table table-xs table-pin-rows w-full bg-base-100">
                        <thead>
                            <tr className="bg-base-200 text-base-content text-xs">
                                <th className="text-center">No. Transaksi</th>
                                <th className="text-center">Tanggal</th>
                                <th className="text-right">Harga Beli</th>
                                <th className="text-right">Harga Jual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hargaItem && hargaItem.length > 0 ? (
                                hargaItem.map((history, idx) => (
                                    <tr key={idx} className="hover:bg-base-200/50">
                                        <td className="text-center font-semibold text-gray-600">
                                            {history.kdItem || "-"}
                                        </td>
                                        <td>
                                            <div className="text-center text-[11px] text-gray-500">
                                                {history.tanggal ? new Date(history.tanggal).toLocaleDateString('id-ID') : '-'}
                                            </div>
                                        </td>
                                        <td className="text-right font-bold text-emerald-600">
                                            {formatRupiah(Number(history.hargaBeli))}
                                        </td>
                                        <td className="text-right font-bold text-emerald-600">
                                            {formatRupiah(Number(history.hargaJual))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                                        Belum ada history pembelian untuk barang ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
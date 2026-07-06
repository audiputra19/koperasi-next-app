'use client';

import { Button } from '@/src/components/ui/Button';
import { addSupplier, editSupplier } from '@/src/features/menu/supplier/action';
import { DaftarItem, MenuState } from '@/src/types/menu';
import { useActionState, useEffect, useState } from 'react';

interface FormSupplierProps {
    onClose: () => void;
    initialData: DaftarItem | null;
}

export default function FormItem({ onClose, initialData }: FormSupplierProps) {
    const isEditMode = !!initialData;
    const actionToUse = isEditMode ? editSupplier : addSupplier;
    const initialState: MenuState = {};
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);

    const [hargaBeli, setHargaBeli] = useState<number>(Number(initialData?.hargaBeli) || 0);
    const [hargaJual, setHargaJual] = useState<number>(Number(initialData?.hargaJual) || 0);
    
    const hitungPersenAwal = () => {
        const beli = Number(initialData?.hargaBeli) || 0;
        const jual = Number(initialData?.hargaJual) || 0;
        if (beli > 0 && jual > 0) {
            return Math.round(((jual - beli) / beli) * 100);
        }
        return 0;
    };
    const [persenUntung, setPersenUntung] = useState<number>(hitungPersenAwal());

    useEffect(() => {
        if (state?.success) {
            onClose();
        }
    }, [state, onClose]);

    const handleHargaBeliChange = (val: number) => {
        setHargaBeli(val);
        if (persenUntung > 0) {
            const hasilJual = val + (val * persenUntung) / 100;
            setHargaJual(Math.round(hasilJual));
        } else if (hargaJual > 0) {
            const hasilPersen = ((hargaJual - val) / val) * 100;
            setPersenUntung(Math.round(hasilPersen) || 0);
        }
    };

    const handlePersenChange = (persen: number) => {
        setPersenUntung(persen);
        if (hargaBeli > 0) {
            const hasilJual = hargaBeli + (hargaBeli * persen) / 100;
            setHargaJual(Math.round(hasilJual));
        }
    };

    const handleHargaJualChange = (jual: number) => {
        setHargaJual(jual);
        if (hargaBeli > 0) {
            const hasilPersen = ((jual - hargaBeli) / hargaBeli) * 100;
            setPersenUntung(Math.round(hasilPersen));
        }
    };

    return (
        <form action={formAction} className="flex flex-col gap-3">
            {isEditMode && (
                <input type="hidden" name="id_supplier" value={initialData.kode} />
            )}

            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Barcode</span></label>
                <input 
                    type="text"
                    name="barcode" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="Masukan barcode barang..." 
                    defaultValue={initialData?.barcode}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Nama Barang</span></label>
                <input 
                    type="text"
                    name="nama" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="Masukan nama barang..." 
                    defaultValue={initialData?.nama}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Jenis</span></label>
                <input 
                    type="text"
                    name="jenis" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="Kategori/Jenis..." 
                    defaultValue={initialData?.jenis}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Satuan</span></label>
                <select 
                    name="satuan"
                    className="select select-bordered w-full bg-base-100 select-md"
                    defaultValue={initialData?.satuan ?? 'pcs'}
                    required
                >
                    <option value="pcs">Pcs</option>
                    <option value="pack">Pack</option>
                    <option value="kg">Kg</option>
                    <option value="liter">Liter</option>
                    <option value="dus">Dus</option>
                    <option value="sachet">Sachet</option>
                </select>
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Rak</span></label>
                <input 
                    type="text"
                    name="rak" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="Lokasi rak..." 
                    defaultValue={initialData?.rak}
                    required
                />
            </div>

            {/* Harga Beli & Harga Jual */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text font-medium">Harga Beli</span></label>
                    <input 
                        type="number"
                        name="hargaBeli" 
                        className="input input-bordered w-full bg-base-100 input-md" 
                        placeholder="0" 
                        value={hargaBeli}
                        onChange={(e) => handleHargaBeliChange(Number(e.target.value))}
                        required
                    />
                </div>
                
                <div className="form-control w-full">
                    <label className="label py-1">
                        <span className="label-text font-medium text-blue-600">Keuntungan (%)</span>
                    </label>
                    <div className="relative flex items-center">
                        <input 
                            type="number"
                            name="persenUntung" 
                            className="input input-bordered w-full bg-base-100 input-md pr-8 font-semibold border-blue-300 focus:border-blue-500" 
                            placeholder="0" 
                            value={persenUntung}
                            onChange={(e) => handlePersenChange(Number(e.target.value))}
                        />
                        <span className="absolute right-3 text-gray-400 font-bold text-sm">%</span>
                    </div>
                </div>

                <div className="form-control w-full">
                    <label className="label py-1"><span className="label-text font-medium">Harga Jual</span></label>
                    <input 
                        type="number"
                        name="hargaJual" 
                        className="input input-bordered w-full bg-base-100 input-md font-bold" 
                        placeholder="0" 
                        value={hargaJual}
                        onChange={(e) => handleHargaJualChange(Number(e.target.value))}
                        required
                    />
                </div>
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Stok Awal</span></label>
                <input 
                    type="number"
                    name="stok" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="0" 
                    defaultValue={initialData?.stok}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Stok Minimal</span></label>
                <input 
                    type="number"
                    name="stokMinimal" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="0" 
                    defaultValue={initialData?.stokMinimal}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium">Status</span></label>
                <select 
                    name="status"
                    className="select select-bordered w-full bg-base-100 select-md"
                    defaultValue={initialData?.status ?? 1}
                    required
                >
                    <option value={1}>Aktif</option>
                    <option value={0}>Non-Aktif</option>
                </select>
            </div>

            <div className="flex justify-end gap-2 border-t border-base-300 pt-4 mt-2">
                <Button
                    onClick={onClose}
                    variant="ghost"
                >
                    Batal
                </Button>
                <Button
                    variant="primary"
                    isLoading={isPending}
                >
                    Simpan Data
                </Button>
            </div>
        </form>
    );
}
'use client';

import { Button } from '@/src/components/ui/Button';
import { useToast } from '@/src/context/ToastContext';
import { addSupplier, editSupplier } from '@/src/features/menu/supplier/action';
import { DaftarSupplier, MenuState } from '@/src/types/menu';
import { useActionState, useEffect } from 'react';

interface FormSupplierProps {
    onClose: () => void;
    initialData: DaftarSupplier | null;
}

export default function FormSupplier({ onClose, initialData }: FormSupplierProps) {
    const isEditMode = !!initialData;
    const actionToUse = isEditMode ? editSupplier : addSupplier;
    const initialState: MenuState = {};
    const [state, formAction, isPending] = useActionState(actionToUse, initialState);
    const { showToast } = useToast();
    
    useEffect(() => {
        if (state?.success) {
            showToast(typeof state.success === "string" ? state.success : "Berhasil disimpan.", "success");
            onClose();
        }
        if (state?.error) {
            showToast(state.error, "error");
        }
    }, [state]);

    return (
        <form action={formAction} className="flex flex-col gap-3">
            {isEditMode && (
                <input type="hidden" name="id_supplier" value={initialData.kode} />
            )}

            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-sm">Nama Supplier</span></label>
                <input 
                    type="text"
                    name="nama_supplier" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="Masukan nama pelanggan..." 
                    defaultValue={initialData?.nama}
                    required
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-sm">Alamat</span></label>
                <textarea 
                    name="alamat"
                    className="textarea w-full bg-base-100"
                    placeholder="Masukan alamat..." 
                    defaultValue={initialData?.alamat}
                    required
                ></textarea>
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
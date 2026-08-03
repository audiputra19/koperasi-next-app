'use client';

import { Button } from '@/src/components/ui/Button';
import { useToast } from '@/src/context/ToastContext';
import { editPelanggan } from '@/src/features/menu/pelanggan/action';
import { SessionPayload } from '@/src/types/auth';
import { DaftarPelanggan, MenuState } from '@/src/types/menu';
import { useActionState, useEffect } from 'react';

interface FormPelangganProps {
    onClose: () => void;
    initialData: DaftarPelanggan | null;
    session: SessionPayload | null;
}

export default function FormPelanggan({ onClose, initialData, session }: FormPelangganProps) {
    const initialState: MenuState = {}
    const [state, formAction, isPending] = useActionState(editPelanggan, initialState);
    const isAnggota = session?.role === "Anggota";
    const isKasir = session?.role === "Kasir";
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
        <form action={formAction} className="flex flex-col gap-4">
            {(!isAnggota && !isKasir) && (
                <>
                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">ID Pelanggan</span></label>
                        <input 
                            type="text" 
                            name="id_pelanggan"
                            className="input input-bordered w-full bg-base-100 input-md read-only:bg-base-300"  
                            defaultValue={initialData?.kode}
                            readOnly
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">Nama Pelanggan</span></label>
                        <input 
                            type="text" 
                            name="nama_pelanggan"
                            className="input input-bordered w-full bg-base-100 input-md read-only:bg-base-300"  
                            defaultValue={initialData?.nama}
                            readOnly
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">Group Pelanggan</span></label>
                        <select 
                            name="id_kategori"
                            className="select select-bordered w-full bg-base-100"
                            defaultValue={initialData?.idKategori}
                        >
                            <option value={1}>Anggota</option>
                            <option value={2}>Non Anggota</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">Bisa Kredit?</span></label>
                        <select 
                            className="select select-bordered w-full bg-base-100"
                            name="kredit"
                            defaultValue={initialData?.kredit}
                        >
                            <option value={0}>Tidak</option>
                            <option value={1}>Ya</option>
                        </select>
                    </div>
                    <div className="form-control w-full">
                        <label className="label py-1"><span className="label-text font-medium text-sm">Role</span></label>
                        <select 
                            className="select select-bordered w-full bg-base-100"
                            name="role"
                            defaultValue={initialData?.role}
                        >
                            <option value="Anggota">Anggota</option>
                            <option value="Admin">Admin</option>
                            <option value="Kasir">Kasir</option>
                            <option value="Pengawas">Pengawas</option>
                        </select>
                    </div>
                </>
            )}
            <div className="form-control w-full">
                <label className="label py-1"><span className="label-text font-medium text-sm">Limit Belanja</span></label>
                <input 
                    type="number"
                    name="limit_belanja" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder="0" 
                    defaultValue={initialData?.limitBelanja ?? 0}
                />
            </div>
            <div className="form-control w-full">
                <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                    Password 
                    {initialData?.hasPassword && (
                        <span className="text-xs text-success font-normal ml-2">
                        ✓ Password sudah tersimpan
                        </span>
                    )}
                    </span>
                </label>

                <input 
                    type="password"
                    name="password" 
                    className="input input-bordered w-full bg-base-100 input-md" 
                    placeholder={initialData?.hasPassword ? "•••••••• (Isi untuk mengubah)" : "Masukkan password baru"}
                    defaultValue=""
                />
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
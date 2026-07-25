"use client";

import { addTransaksiPembelian, editTransaksiPembelian } from "@/src/features/pembelian/action";
import { cn } from "@/src/lib/cn";
import { usePembelianStore } from "@/src/store/usePembelianStore";
import { DaftarItem } from "@/src/types/menu";
import { EditPembelianPayload, PembelianPayload } from "@/src/types/pembelian";
import { ClipboardPen, Minus, Plus, Trash2 } from "lucide-react";
import moment from "moment-timezone";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "../ui/Button";
import { Autocomplete } from "../ui/AutoComplete";
import Modal from "../ui/Modal";
import FormItem from "@/src/app/(dashboard)/(menuUtama)/daftarItem/FormItem";

interface StepInputItemProps {
    dataItem: DaftarItem[];
    initialUser: { nama: string } | null;
    onEditHarga: (item: string) => void;
}

export function StepInputBarang({ dataItem, initialUser, onEditHarga }: StepInputItemProps) {
    const { 
        addBarang,
        listSupplier, 
        listBarang, 
        total, 
        metode,
        datePembelian, 
        // user, 
        prevStep, 
        resetPembelian ,
        removeBarang,
        updateExpireDateBarang,
        updateQtyBarang
    } = usePembelianStore();   

    const [isPending, startTransition] = useTransition();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const searchParams = useSearchParams();
    const idTransaksiEdit = searchParams.get("id"); 
    const isEditMode = !!idTransaksiEdit;
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DaftarItem | null>(null);

    const handleOpenModal = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    const handleSelectBarang = (selected: DaftarItem) => {
        addBarang({
            barcode: selected.barcode,
            kodeItem: selected.kode,
            namaItem: selected.nama,
            jenis: selected.jenis,
            satuan: selected.satuan,
            harga: selected.hargaBeli,
            expireDate: ""
        });
    };

    // const totalHarga = listBarang.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    const totalHarga = usePembelianStore((state) => state.total);

    const showAlert = (msg: string) => alert(msg);
    const handleBeli = async () => {
        if (!listSupplier || !listSupplier.kodeSupplier || !listSupplier.namaSupplier) {
            showAlert("Supplier belum dipilih");
            return;
        }

        const dataPembelian = listBarang.map(item => ({
            barcode: item.barcode,
            kodeItem: item.kodeItem,
            namaItem: item.namaItem,
            jenis: item.jenis,
            jumlah: item.jumlah,
            satuan: item.satuan,
            harga: item.harga,
            expiredDate: item.expireDate
        }));

        const dataSupplier = {
            kodeSupplier: listSupplier.kodeSupplier,
            namaSupplier: listSupplier.namaSupplier,
        };

        const basePayload = {
            userBuat: initialUser?.nama || "Kasir System",
            total: total,
            metode: Number(metode),
            startDate: datePembelian,
            dataPembelian,
            dataSupplier,
        };

        setErrorMessage(null);

        startTransition(async () => {
            let result;

            if (isEditMode && idTransaksiEdit) {
                const editPayload: EditPembelianPayload = {
                    ...basePayload,
                    idTransaksi: idTransaksiEdit
                };
                result = await editTransaksiPembelian(editPayload);
            } else {
                const addPayload: PembelianPayload = basePayload;
                result = await addTransaksiPembelian(addPayload);
            }

            if (result.error) {
                setErrorMessage(result.error);
            } else if (result.success) {
                showAlert(result.success);
                resetPembelian();
                router.push("/daftarPembelian");
            }
        });
    };

    return (
        <>
            <div className="p-6 border border-base-300 rounded-xl bg-base-100 space-y-4 mx-auto">
                <div>
                    <h3 className="text-lg font-bold">Input Item Belanja</h3>
                </div>

                {errorMessage && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        ⚠️ {errorMessage}
                    </div>
                )}

                    {/* Bagian Autocomplete pencarian barang */}
                    <div className="w-full">
                        <label className="text-sm font-medium text-gray-500 block mb-1">Cari Item</label>
                        <div className="flex justify-between gap-5">
                            <div className="w-full max-w-md">
                                <Autocomplete
                                    options={dataItem}
                                    placeholder="Ketik nama atau barcode item..."
                                    selectedValue=""
                                    valueKey="barcode"
                                    labelKey="nama"
                                    onSelect={handleSelectBarang}
                                />
                            </div>    
                            <div>
                                <Button 
                                    className="flex gap-2"
                                    variant="primary"
                                    size="sm"
                                    onClick={handleOpenModal}
                                >
                                    <Plus size={18} />
                                    Tambah Item    
                                </Button>
                            </div>
                        </div>
                </div>

                <div className="border border-base-300 rounded-lg overflow-x-auto w-full">
                    <table className="w-full text-center text-sm">
                        <thead>
                            <tr className="bg-base-200 font-semibold border-b border-base-300">
                                <th className="p-3">Kode</th>
                                <th className="p-3">Nama Item</th>
                                <th className="p-3">Jenis</th>
                                <th className="p-3">Harga</th>
                                <th className="p-3">Jumlah</th>
                                <th className="p-3">Expired</th>
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
                                        <td className="p-3 font-mono text-xs min-w-[100px]">{item.barcode}</td>
                                        <td className="p-3 font-medium min-w-[200px]">{item.namaItem}</td>
                                        <td className="p-3 font-medium min-w-[100px]">{item.jenis}</td>
                                        <td className="p-3 text-right min-w-[150px]">
                                            <div className={cn(
                                                !isEditMode && "flex justify-end items-center gap-3"
                                            )}>
                                                Rp {item.harga.toLocaleString()}
                                                {!isEditMode && (
                                                    <div className="tooltip" data-tip="Edit Harga">
                                                        <ClipboardPen
                                                            className="text-primary cursor-pointer p-1 rounded hover:bg-base-300"
                                                            size={25} 
                                                            onClick={() => onEditHarga(item.kodeItem)}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        
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
                                        <td className="p-3">
                                            <input 
                                                type="date" 
                                                value={moment(item.expireDate).format("YYYY-MM-DD") || ""} 
                                                onChange={(e) => updateExpireDateBarang(item.kodeItem, e.target.value)}
                                                className="w-full border border-base-300 rounded px-2 py-0.5 text-xs bg-base-100 font-medium text-center focus:outline-none focus:border-blue-500" 
                                            />
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
                            onClick={handleBeli} 
                            isLoading={isPending}
                            disabled={listBarang.length === 0}
                            className= "disabled:bg-gray-300"
                        >
                            {isPending ? "Memproses Data..." : isEditMode ? "Update Perubahan" : "Proses Pembelian"}
                        </Button>
                    </div>
                </div>
            </div>
            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={selectedItem ? "Edit Data Harga" : "Tambah Item Baru"}
            >
                <FormItem 
                    onClose={handleCloseModal} 
                    initialData={selectedItem}
                />
            </Modal>
        </>
    );
}
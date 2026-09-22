'use client';

import { Button } from '@/src/components/ui/Button';
import { useToast } from '@/src/context/ToastContext';
import { DaftarItem } from '@/src/types/menu';
import { KartuStokItem } from '@/src/types/item';
import { useState } from 'react';
import { ItemService } from '@/src/features/menu/item/item.service';

interface FormStockProps {
    initialData: DaftarItem | null;
}

const getFirstMonth = () => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().split('T')[0];
};

const getToday = () => {
    const d = new Date();
    return d.toISOString().split('T')[0];
};

export default function FormStock({ initialData }: FormStockProps) {
    const { showToast } = useToast();
    const [tanggalAwal, setTanggalAwal] = useState(getFirstMonth());
    const [tanggalAkhir, setTanggalAkhir] = useState(getToday());
    const [data, setData] = useState<KartuStokItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const formatAngka = (value: number) => new Intl.NumberFormat('id-ID').format(value);

    const formatTanggal = (value: string) =>
        new Date(value).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

    const handleTampilkan = async () => {
        if (!initialData?.kode) return;

        if (tanggalAwal > tanggalAkhir) {
            showToast('Tanggal awal tidak boleh lebih besar dari tanggal akhir', 'error');
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        try {
            const res = await ItemService.getStockItem({
                kode: initialData.kode,
                tanggal_awal: tanggalAwal,
                tanggal_akhir: tanggalAkhir,
            });
            setData(res.data ?? []);
        } catch (error) {
            showToast('Gagal mengambil data kartu stok', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-end gap-3">
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium text-sm">Dari Tanggal</span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered input-sm bg-base-100"
                        value={tanggalAwal}
                        onChange={(e) => setTanggalAwal(e.target.value)}
                    />
                </div>
                <div className="form-control">
                    <label className="label py-1">
                        <span className="label-text font-medium text-sm">Sampai Tanggal</span>
                    </label>
                    <input
                        type="date"
                        className="input input-bordered input-sm bg-base-100"
                        value={tanggalAkhir}
                        onChange={(e) => setTanggalAkhir(e.target.value)}
                    />
                </div>
                <Button variant="primary" size="sm" onClick={handleTampilkan} isLoading={isLoading}>
                    Tampilkan
                </Button>
            </div>

            <div className="overflow-x-auto border border-base-300 rounded-lg">
                <table className="table table-sm w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>No. Transaksi</th>
                            <th>Tanggal</th>
                            <th>Keterangan</th>
                            <th className="text-right">Masuk</th>
                            <th className="text-right">Keluar</th>
                            <th className="text-right">Saldo</th>
                            <th>Pelanggan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-400">
                                    Memuat data...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-6 text-gray-400">
                                    {hasSearched ? 'Tidak ada data pada periode ini' : 'Pilih periode lalu klik Tampilkan'}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, idx) => (
                                <tr key={`${row.no_transaksi}-${idx}`}>
                                    <td>{row.no_transaksi}</td>
                                    <td>{formatTanggal(row.tanggal)}</td>
                                    <td>{row.keterangan}</td>
                                    <td className="text-right text-green-600">
                                        {row.masuk > 0 ? formatAngka(row.masuk) : '-'}
                                    </td>
                                    <td className="text-right text-red-500">
                                        {row.keluar > 0 ? formatAngka(row.keluar) : '-'}
                                    </td>
                                    <td className="text-right font-semibold">{formatAngka(row.saldo)}</td>
                                    <td>{row.pelanggan}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
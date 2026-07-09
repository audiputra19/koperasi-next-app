'use client';

import DaftarSupplierTable from '@/src/components/daftarSupplier/DaftarSupplierTable';
import { Button } from '@/src/components/ui/Button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import FormSupplier from './FormSupplier';
import { DaftarSupplier } from '@/src/types/menu';
import Modal from '@/src/components/ui/Modal';

interface DaftarSupplierClientProps {
    dataAwal: DaftarSupplier[];
}

export default function DaftarSupplierClient({ dataAwal }: DaftarSupplierClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<DaftarSupplier | null>(null);

    const handleOpenModal = () => {
        setSelectedSupplier(null);
        setIsModalOpen(true);
    }

    const handleOpenEditModal = (supplier: DaftarSupplier) => {
        setSelectedSupplier(supplier);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setSelectedSupplier(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">
            <div className="flex justify-end">
                <Button 
                    className="flex gap-2"
                    variant="primary"
                    size="sm"
                    onClick={handleOpenModal}
                >
                    <Plus size={18} />
                    Tambah Supplier    
                </Button>
            </div>

            <DaftarSupplierTable 
                dataAwal={dataAwal} 
                onEdit={handleOpenEditModal}
            />

            <Modal
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={selectedSupplier ? "Edit Data Supplier" : "Tambah Supplier Baru"}
            >
                <FormSupplier 
                    onClose={handleCloseModal}
                    initialData={selectedSupplier}
                />
            </Modal>
        </div>
    );
}
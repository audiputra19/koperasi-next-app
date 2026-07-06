'use client';

import Modal from "@/src/components/common/Modal";
import DaftarItemTable from '@/src/components/daftarItem/DaftarItemTable';
import { Button } from "@/src/components/ui/Button";
import { DaftarItem } from '@/src/types/menu';
import { Plus } from "lucide-react";
import { useState } from 'react';
import FormItem from './FormItem';

interface DaftarItemClientProps {
    dataAwal: [];
}

export default function DaftarItemClient({ dataAwal }: DaftarItemClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DaftarItem | null>(null);

    const handleOpenModal = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    }

    const handleOpenEditModal = (item: DaftarItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setSelectedItem(null);
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
                    Tambah Item    
                </Button>
            </div>

            <DaftarItemTable 
                dataAwal={dataAwal} 
                onEdit={handleOpenEditModal}
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={selectedItem ? "Edit Data Item" : "Tambah Item Baru"}
            >
                <FormItem 
                    onClose={handleCloseModal} 
                    initialData={selectedItem}
                />
            </Modal>
        </div>
    );
}
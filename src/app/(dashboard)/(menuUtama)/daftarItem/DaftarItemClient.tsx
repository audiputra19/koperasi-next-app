'use client';

import Modal from "@/src/components/ui/Modal";
import DaftarItemTable from '@/src/components/daftarItem/DaftarItemTable';
import { Button } from "@/src/components/ui/Button";
import { DaftarItem } from '@/src/types/menu';
import { Plus } from "lucide-react";
import { useState } from 'react';
import FormItem from './FormItem';
import { SessionPayload } from "@/src/types/auth";
import FormStock from "./FormStock";

interface DaftarItemClientProps {
    dataAwal: [];
    session: SessionPayload | null;
}

type ModalMode = 'add' | 'edit' | 'stock';

export default function DaftarItemClient({ dataAwal, session }: DaftarItemClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DaftarItem | null>(null);
    const [modalMode, setModalMode] = useState<ModalMode>('add');

    const handleOpenModal = () => {
        setSelectedItem(null);
        setModalMode('add');
        setIsModalOpen(true);
    }

    const handleOpenEditModal = (item: DaftarItem) => {
        setSelectedItem(item);
        setModalMode('edit');
        setIsModalOpen(true);
    }

    const handleOpenStockModal = (item: DaftarItem) => {
        setSelectedItem(item);
        setModalMode('stock');
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setSelectedItem(null);
        setIsModalOpen(false);
    };

    const modalTitle =
        modalMode === 'stock'
            ? "Kartu Stok"
            : selectedItem
                ? "Edit Data Harga"
                : "Tambah Item Baru";

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
                onStock={handleOpenStockModal}
                session={session}
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title={modalTitle}
                className={modalMode === 'stock' ? "max-w-[800px]" : "max-w-[500px]"}
            >
                {modalMode === 'stock' ? (
                    <FormStock 
                        initialData={selectedItem}
                    />
                ) : (
                    <FormItem 
                        onClose={handleCloseModal} 
                        initialData={selectedItem}
                    />
                )}
            </Modal>
        </div>
    );
}
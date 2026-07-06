'use client';

import React, { useState } from 'react';
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import Modal from "@/src/components/common/Modal";
import FormPelanggan from "./FormPelanggan";
import DaftarPelangganTable from '@/src/components/daftarPelanggan/DaftarPelangganTable';
import { DaftarPelanggan } from '@/src/types/menu';

interface DaftarPelangganClientProps {
    dataAwal: [];
}

export default function DaftarPelangganClient({ dataAwal }: DaftarPelangganClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPelanggan, setSelectedPelanggan] = useState<DaftarPelanggan | null>(null);

    const handleOpenEditModal = (pelanggan: DaftarPelanggan) => {
        setSelectedPelanggan(pelanggan);
        setIsModalOpen(true);
    }

    const handleCloseModal = () => {
        setSelectedPelanggan(null);
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">

            <DaftarPelangganTable 
                dataAwal={dataAwal} 
                onEdit={handleOpenEditModal}
            />

            <Modal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                title="Edit Data Pelanggan"
            >
                <FormPelanggan 
                    onClose={handleCloseModal} 
                    initialData={selectedPelanggan}
                />
            </Modal>
        </div>
    );
}
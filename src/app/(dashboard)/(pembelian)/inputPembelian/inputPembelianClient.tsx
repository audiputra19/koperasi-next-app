"use client";

import { StepInputBarang } from "@/src/components/inputPembelian/StepInputBarang";
import { StepInputSupplier } from "@/src/components/inputPembelian/StepInputSupplier";
import { Button } from "@/src/components/ui/Button";
import { cn } from "@/src/lib/cn";
import { usePembelianStore } from "@/src/store/usePembelianStore";
import { DaftarItem, DaftarSupplier } from "@/src/types/menu";
import { ShoppingBag, User } from "lucide-react"; // Install lucide-react jika belum
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface InputPembelianClientProps {
    dataSupplier: DaftarSupplier[];
    dataItem: DaftarItem[];
    initialUser: { nama: string } | null;
}

export function InputPembelianClient({ dataSupplier, dataItem, initialUser }: InputPembelianClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idTransaksi = searchParams.get("id");
    const isEditMode = !!idTransaksi;
    const { step, resetPembelian } = usePembelianStore((state) => state);

    useEffect(() => {
        if (!idTransaksi) {
            resetPembelian();
        }
    }, [idTransaksi, resetPembelian]);

    const handleBatalEdit = () => {
        resetPembelian();
        router.push("/daftarPembelian");
    };

    const stepsConfig = [
        { id: 1, label: "Supplier", icon: User },
        { id: 2, label: "Pilih Barang", icon: ShoppingBag },
    ];

    const renderStepContent = () => {
        switch(step) {
            case 1:
                return <StepInputSupplier dataSupplier={dataSupplier} />;
            case 2:    
                return <StepInputBarang dataItem={dataItem} initialUser={initialUser} />;
            default:
                return <div className="p-8 text-center text-gray-500">Langkah tidak ditemukan</div>;        
        }
    };

    return (
        <div className={cn("w-full max-w-[1000px] mx-auto space-y-5 md:px-0")}>
            {isEditMode && (
                <div className="flex justify-between items-center px-1 gap-5">
                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-sm font-medium">
                            No. Transaksi: <strong className="font-bold text-base-content">{idTransaksi}</strong>
                        </span>
                    </div>
                    <Button 
                        variant="secondary"
                        onClick={handleBatalEdit}
                        className="min-w-[110px]"
                    >
                        Batal Edit
                    </Button>
                </div>
            )}

            <div className="bg-base-100 border border-base-300 rounded-lg p-5">
                <div className="flex items-center justify-between max-w-3xl mx-auto relative">
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-base-300 -translate-y-1/2 z-0 hidden sm:block" />
                    
                    {stepsConfig.map((s, index) => {
                        const IconComponent = s.icon;
                        const isCompleted = step > s.id;
                        const isActive = step === s.id;

                        return (
                            <div key={s.id} className="flex flex-col items-center flex-1 z-10 relative">
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border-2 font-semibold",
                                    isCompleted && "bg-blue-600 border-blue-600 text-white",
                                    isActive && "bg-base-100 border-blue-500 text-blue-600 scale-110 ring-4 ring-base-100",
                                    !isActive && !isCompleted && "bg-base-100 border-base-300 text-gray-400"
                                )}>
                                    {isCompleted ? (
                                        <span className="text-sm">✓</span>
                                    ) : (
                                        <IconComponent size={16} />
                                    )}
                                </div>
                                <span className={cn(
                                    "mt-2 text-xs font-medium tracking-wide transition-colors duration-300 hidden sm:block",
                                    isActive ? "text-blue-600 font-semibold" : isCompleted ? "text-gray-500" : "text-gray-400"
                                )}>
                                    {s.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-2">
                {renderStepContent()}
            </div>
        </div>
    );
}
'use client';

import DaftarSonTable from "@/src/components/persediaan/DaftarSonTable";
import { Button } from "@/src/components/ui/Button";
import { SessionPayload } from "@/src/types/auth";
import { SonListItem } from "@/src/types/son";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface DaftarSonClientProps {
    initialData: SonListItem[];
    session: SessionPayload | null;
}

export default function DaftarSonClient({ initialData, session }: DaftarSonClientProps) {
    const router = useRouter();

    const handleAddSon = () => {
        router.push("/inputSon");
    };

    return (
        <div className="flex flex-col gap-3 w-full max-w-[1000px]">
            <div className="flex justify-end">
                <Button
                    className="flex gap-2"
                    variant="primary"
                    size="sm"
                    onClick={handleAddSon}
                >
                    <Plus size={18} />
                    Input SON
                </Button>
            </div>

            <DaftarSonTable
                initialData={initialData}
                session={session}
            />
        </div>
    );
}
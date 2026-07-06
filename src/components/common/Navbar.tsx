"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { useActionState } from "react";
import { logout } from "@/src/features/auth/action";
import { AuthState, SessionPayload } from "@/src/types/auth";
import { Menu } from "lucide-react";
import { useSidebarMobile } from "@/src/context/SidebarContext";

interface NavbarProps {
    session: SessionPayload | null
}

export default function Navbar({ session }: NavbarProps) {
    const pathname = usePathname();
    const { openSidebar } = useSidebarMobile();
    const lastSegment = pathname.split("/").pop() || "";
    const formattedTitle = lastSegment
        ? lastSegment
              // Menambahkan spasi sebelum huruf kapital (misal: daftarBelanja -> daftar Belanja)
              .replace(/([A-Z])/g, " $1")
              // Memastikan huruf pertama dari seluruh string menjadi kapital
              .replace(/^./, (str) => str.toUpperCase())
              // Membersihkan spasi di awal jika ada
              .trim()
        : "Home";
    const initialState: AuthState = {};
    const [state, formAction, isPending] = useActionState(logout, initialState);   

    return (
        <div className="sticky top-0 px-5 py-3 bg-base-100 border-b border-base-300 z-40">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={openSidebar} 
                        className="md:hidden p-1 rounded-md hover:bg-base-300 transition-colors cursor-pointer"
                    >
                        <Menu size={24} />
                    </button>
                    <h1 className="font-bold">{formattedTitle}</h1>
                </div>
                <div>
                    <form action={formAction}>
                        <Button
                            className="bg-red-500"
                            size="sm"
                            isLoading={isPending}
                        >
                            Log out
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
"use client";

import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { useActionState } from "react";
import { logout } from "@/src/features/auth/action";
import { AuthState, SessionPayload } from "@/src/types/auth";
import { ChevronDown, LogOut, Menu, Settings2, User } from "lucide-react";
import { useSidebarMobile } from "@/src/context/SidebarContext";
import Link from "next/link";

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
                <div className="hidden sm:block">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold"
                            >
                            {session?.nama.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-bold">{session?.nama}</p>
                        </div>
                        <div className="dropdown dropdown-bottom dropdown-end">
                            <div tabIndex={0} className="cursor-pointer p-2 rounded-full hover:bg-base-300">
                                <ChevronDown size={20} />
                            </div>
                            <ul tabIndex={0} className="dropdown-content gap-2 menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xl border border-base-300 mt-5">
                                {/* <li>
                                    <a><User size={20}/>Profile</a>
                                </li> */}
                                <li>
                                    <Link href="/settings">
                                        <Settings2 size={20} />Settings
                                    </Link>
                                </li>
                                <li className="border-t border-base-300 pt-2">
                                    <form action={formAction}>
                                        <button
                                            type="submit"
                                            disabled={isPending}
                                            className="w-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <LogOut size={20} />
                                            {isPending ? "Logging out..." : "Logout"}
                                        </button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
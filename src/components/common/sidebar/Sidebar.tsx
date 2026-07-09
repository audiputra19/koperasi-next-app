"use client";

import logo from '@/public/images/koperasi-logo.jpg';
import { useSidebarMobile } from "@/src/context/SidebarContext";
import { cn } from "@/src/lib/cn";
import { MenuItem, MenuItemWithDropdown, SidebarMenuItem } from "@/src/types/sidebar";
import { ChevronDown, FileText, Layers, LayoutDashboard, LogOut, Package, PanelLeftClose, PanelLeftOpen, Settings2, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useActionState, useState } from "react";
import SidebarDropdown from "./SidebarDropdown";
import SidebarLink from "./SidebarLink";
import Link from 'next/link';
import { AuthState, SessionPayload } from '@/src/types/auth';
import { logout } from '@/src/features/auth/action';

interface SidebarProps {
    session: SessionPayload | null
}

export default function Sidebar({ session }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const { isMobileOpen, closeSidebar } = useSidebarMobile();
    const initialState: AuthState = {};
    const [state, formAction, isPending] = useActionState(logout, initialState);
    
    const menuData: SidebarMenuItem[] = [
        {
            id: '1',
            name: 'Dashboard',
            icon: <LayoutDashboard size={22} />,
            path: '/dashboard'
        },
        {
            id: '2',
            name: 'Menu Utama',
            icon: <Layers size={22} />,
            subMenu: [
                { id: '2-1', name: 'Daftar Pelanggan', path: '/daftarPelanggan' },
                { id: '2-2', name: 'Daftar Supplier', path: '/daftarSupplier' },
                { id: '2-3', name: 'Daftar Item', path: '/daftarItem' }
            ]
        },
        {
            id: '3',
            name: 'Pembelian',
            icon: <ShoppingCart size={22} />,
            subMenu: [
                { id: '3-1', name: 'Daftar Pembelian', path: '/daftarPembelian' },
                { id: '3-2', name: 'Input Pembelian', path: '/inputPembelian' }
            ]
        },
        {
            id: '4',
            name: 'Penjualan',
            icon: <Package size={22} />,
            subMenu: [
                { id: '4-1', name: 'Daftar Penjualan', path: '/daftarPenjualan' },
                { id: '4-2', name: 'Input Kasir', path: '/inputKasir' }
            ]
        },
        {
            id: '5',
            name: 'Laporan',
            icon: <FileText size={22} />,
            path: '/laporan'
        }
    ];

    return (
        <>
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 z-50 backdrop-blur-xs md:hidden" 
                    onClick={closeSidebar}
                />
            )}
            <aside
                className={cn(
                    "bg-base-100 h-screen border-r border-base-300 p-3 transition-all duration-300 z-50 hidden md:flex md:flex-col md:sticky top-0",
                    isCollapsed ? 'sm:w-[78px]' : 'sm:w-[240px]',
                    
                    // Mobile
                    "fixed w-[250px] flex flex-col",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className={`flex items-center pl-3 py-3 pr-2 h-[55px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <div
                        className={cn(
                            "flex gap-3.5 items-center overflow-hidden transition-all duration-300",
                            (isCollapsed && !isMobileOpen)
                                ? "w-0 opacity-0 invisible pointer-events-none"
                                : "w-auto opacity-100 visible"
                        )}
                    >
                        <Image
                            src={logo}
                            alt="Login Image"
                            width={30}
                            height={30}
                            className="z-999 shrink-0"
                            priority
                        />
                        <h1 className="font-black text-xl whitespace-nowrap">Kopsa</h1>
                    </div>
                    
                    <button 
                        onClick={() => {
                            if (window.innerWidth < 768) {
                                closeSidebar();
                            } else {
                                setIsCollapsed(!isCollapsed);
                            }
                        }}
                        className="rounded-lg hover:bg-base-300 transition-colors cursor-pointer p-1.5"
                    >
                        <span className="md:hidden">
                            <X size={22} />
                        </span>
                        <span className="hidden md:block">
                            {!isCollapsed ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
                        </span>
                    </button>
                </div>

                <div className="mt-3 mx-1 space-y-1 flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-3 sm:pb-3">
                    {menuData.map((item) => {
                        if ('subMenu' in item && item.subMenu && item.subMenu.length > 0) {
                            return <SidebarDropdown key={item.id} item={item as MenuItemWithDropdown} isCollapsed={isCollapsed} />;
                        }
                        return <SidebarLink key={item.id} item={item as MenuItem} isCollapsed={isCollapsed} />
                    })}
                </div>

                <div className="sm:hidden mt-auto pt-3 px-1 bg-base-100 border-t border-base-300 shrink-0">
                    <div className={cn(
                        "flex items-center gap-2 justify-between"
                    )}>
                        <div className="flex gap-2 items-center min-w-0">
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold shrink-0">
                                {session?.nama?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-bold truncate">{session?.nama}</p>
                            </div>
                        </div>
                        
                        <div className="dropdown dropdown-top dropdown-end">
                            <div tabIndex={0} className="cursor-pointer p-2 rounded-full hover:bg-base-300">
                                <ChevronDown size={20} />
                            </div>
                            <ul tabIndex={0} className="dropdown-content gap-2 menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-xl border border-base-300 mb-2">
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
            </aside>
        </>
    )
}
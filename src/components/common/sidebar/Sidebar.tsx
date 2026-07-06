"use client";

import logo from '@/public/images/koperasi-logo.jpg';
import { useSidebarMobile } from "@/src/context/SidebarContext";
import { cn } from "@/src/lib/cn";
import { MenuItem, MenuItemWithDropdown, SidebarMenuItem } from "@/src/types/sidebar";
import { FileText, Layers, LayoutDashboard, Package, PanelLeftClose, PanelLeftOpen, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import SidebarDropdown from "./SidebarDropdown";
import SidebarLink from "./SidebarLink";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const { isMobileOpen, closeSidebar } = useSidebarMobile();
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
                {
                    id: '2-1',
                    name: 'Daftar Pelanggan',
                    path: '/daftarPelanggan'
                },
                {
                    id: '2-2',
                    name: 'Daftar Supplier',
                    path: '/daftarSupplier'
                },
                {
                    id: '2-3',
                    name: 'Daftar Item',
                    path: '/daftarItem'
                }
            ]
        },
        {
            id: '3',
            name: 'Pembelian',
            icon: <ShoppingCart size={22} />,
            subMenu: [
                {
                    id: '3-1',
                    name: 'Daftar Pembelian',
                    path: '/daftarPembelian'
                },
                {
                    id: '3-2',
                    name: 'Input Pembelian',
                    path: '/inputPembelian'
                }
            ]
        },
        {
            id: '4',
            name: 'Penjualan',
            icon: <Package size={22} />,
            subMenu: [
                {
                    id: '4-1',
                    name: 'Daftar Penjualan',
                    path: '/daftarPenjualan'
                },
                {
                    id: '4-2',
                    name: 'Input Kasir',
                    path: '/inputKasir'
                }
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
                    // Default Desktop style
                    "bg-base-100 min-h-screen border-r border-base-300 p-3 transition-all duration-300 z-50 hidden md:block md:sticky top-0 bottom-0 left-0",
                    isCollapsed ? 'sm:w-[78px]' : 'sm:w-[240px]',
                    
                    // Mobile Overrides style
                    "fixed w-[250px] block",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className={`flex items-center pl-3 py-3 pr-2 h-[55px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="flex gap-3.5 items-center">
                            {/* <Store size={32} className="shrink-0" /> */}
                            <Image 
                                src={logo}
                                alt="Login Image"
                                width={30}
                                height={30}
                                className="z-999"
                                priority
                            />
                            <h1 className="font-black text-xl transition-all duration-200">Kopsa</h1>
                        </div>
                    )}
                    
                    {/* Tombol aksi */}
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
                <div className="mt-3 mx-1 space-y-1">
                    {menuData.map((item) => {
                        if ('subMenu' in item && item.subMenu && item.subMenu.length > 0) {
                            return <SidebarDropdown key={item.id} item={item as MenuItemWithDropdown} isCollapsed={isCollapsed} />;
                        }

                        return <SidebarLink key={item.id} item={item as MenuItem} isCollapsed={isCollapsed} />
                    })}
                </div>
            </aside>
        </>
    )
}
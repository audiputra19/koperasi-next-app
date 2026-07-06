'use client';

import clsx from "clsx";
import { FileText, LayoutDashboard, Package, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TabBarMobile() {
    const pathname =  usePathname();
    const menuData = [
        {
            id: '1',
            name: 'Dashboard',
            icon: <LayoutDashboard size={22} />,
            path: '/dashboard'
        },
        {
            id: '2',
            name: 'Pembelian',
            icon: <ShoppingCart size={22} />,
            path: '/daftarPembelian'
        },
        {
            id: '3',
            name: 'Penjualan',
            icon: <Package size={22} />,
            path: '/daftarPenjualan'
        },
        {
            id: '4',
            name: 'Laporan',
            icon: <FileText size={22} />,
            path: '/laporan'
        }
    ];

    return (
        <div className="fixed bottom-0 bg-base-100 w-full p-3 z-40">
            <div className="grid grid-cols-4">
                {menuData.map((item) => {
                    const isActive = pathname === item.path;

                    return (
                        <Link 
                            href={item.path}
                            key={item.id} 
                            className="flex flex-col justify-center items-center gap-1"
                        >
                            <div 
                                className={clsx("p-2",
                                    isActive ? "rounded-xl bg-primary text-primary-content" : ""
                                )}
                            >
                                {item.icon}
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
} 
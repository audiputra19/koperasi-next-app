'use client';

import { routeAccess } from "@/src/lib/roleAccess";
import { Role, SessionPayload } from "@/src/types/auth";
import clsx from "clsx";
import { FileText, LayoutDashboard, Package, PackageOpen } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabBarMobileProps {
    session: SessionPayload | null;
}

export default function TabBarMobile({ session }: TabBarMobileProps) {
    const pathname =  usePathname();
    const role = (session?.role as Role) ?? "Anggota";
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
            icon: <Package size={22} />,
            path: '/daftarPembelian'
        },
        {
            id: '3',
            name: 'Penjualan',
            icon: <PackageOpen size={22} />,
            path: '/daftarPenjualan'
        },
        {
            id: '4',
            name: 'Laporan',
            icon: <FileText size={22} />,
            path: '/laporan'
        }
    ];

    const visibleMenu = menuData.filter((item) => {
        const allowed = routeAccess[item.path];
        return !allowed || allowed.includes(role);
    });

    return (
        <div className="fixed bottom-0 bg-base-100 w-full p-3 z-40">
            <div
                className="grid place-items-center"
                style={{ gridTemplateColumns: `repeat(${visibleMenu.length}, minmax(0, 1fr))` }}
            >
                {visibleMenu.map((item) => {
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
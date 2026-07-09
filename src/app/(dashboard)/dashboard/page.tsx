import { cn } from "@/src/lib/cn"
import { DashboardService } from "@/src/features/dashboard/dashboard.service";
import { AlertTriangle, ArrowRight, CalendarX, Flame, Handshake, ToolCase, Users } from "lucide-react";
import moment from "moment-timezone";
import Link from "next/link";

export default async function DashboardPage() {

    const [
        totalAnggota, 
        totalSupplier, 
        totalItem, 
        populerItems, 
        restockItems, 
        expiredItems
    ] = await Promise.all([
        DashboardService.getTotalAnggota(),
        DashboardService.getTotalSupllier(),
        DashboardService.getTotalItem(),
        DashboardService.getPopulerItem(), // Asumsi: kembalikan array/object data
        DashboardService.getRestockItem(), 
        DashboardService.getExpiredItem(),
    ]);

    const statsData = [
        { id: "anggota", title: "Total Anggota", value: totalAnggota.total, icon: <Users />, path: "/daftarPelanggan" },
        { id: "supplier", title: "Total Supplier", value: totalSupplier.total, icon: <Handshake />, path: "/daftarSupplier" },
        { id: "item", title: "Total Item", value: totalItem.total, icon: <ToolCase />, path: "/daftarItem" },
    ];

    const listPopuler = Array.isArray(populerItems) ? populerItems : [populerItems];
    const listRestock = Array.isArray(restockItems) ? restockItems : [restockItems];
    const listExpired = Array.isArray(expiredItems) ? expiredItems : [expiredItems];

    return (
        <main className={cn(
            "p-5 w-full flex justify-center"
        )}>
            <div className={cn(
                "w-full max-w-[1000px]"
            )}>
                {/* STATS CARDS */}
                <div className={cn(
                    "grid grid-cols-1 gap-4",
                    "md:grid-cols-2",
                    "lg:grid-cols-3"
                )}>
                    {statsData.map((item) => (
                        <div 
                            key={item.id} 
                            className={cn(
                                "bg-base-100 border border-base-300 rounded-xl"
                            )}
                        >
                            <div className={cn(
                                "px-5 pt-5 flex justify-between items-center"
                            )}>
                                <div className="font-semibold">
                                    {item.title}
                                </div>
                                <div className={cn(
                                    "p-2 bg-primary text-primary-content rounded-xl"
                                )}>
                                    {item.icon}
                                </div>
                            </div>
                            <div className={cn(
                                "py-3 px-5 text-3xl font-bold"
                            )}>
                                {item.value}
                            </div>
                            <Link href={item.path}>
                                <div className={cn(
                                    "border-t border-base-300 px-5 py-2 cursor-pointer group/translate rounded-b-xl",
                                    "hover:bg-primary/5"
                                )}>
                                    <div className={cn(
                                        "text-gray-500 flex justify-between items-center",
                                        "group-hover/translate:text-primary"
                                    )}>
                                        <div className="text-sm">Detail</div>
                                        <div className={cn(
                                            "transition-transform",
                                            "group-hover/translate:translate-x-1.5", 
                                            "group-hover/translate:duration-300 group-hover/translate:scale-110",
                                        )}>
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                {/* DYNAMIC BOTTOM LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                    
                    <div className="lg:col-span-2 flex flex-col gap-4">
                        
                        {/* Restock Alerts */}
                        <div className="bg-base-100 border border-base-300 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-4 text-warning">
                                <div className="p-2 bg-warning/10 rounded-xl">
                                    <AlertTriangle size={20} />
                                </div>
                                <h2 className="font-bold text-lg text-base-content">Perlu Restock</h2>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
                                <table className="table w-full text-sm table-pin-rows">
                                    <thead>
                                        <tr className="border-b border-base-300 text-center text-base-content/60">
                                            <th className="pb-2">Barcode</th>
                                            <th className="pb-2">Nama Barang</th>
                                            <th className="pb-2">Minimum Stok</th>
                                            <th className="pb-2">Jumlah</th>
                                            <th className="pb-2">Rak</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listRestock.length > 0 ? (
                                            listRestock.map((item, idx) => (
                                                <tr key={idx} className="border-b border-base-200 last:border-none">
                                                    <td className="py-3 font-mono text-sm text-center min-w-[100px]">{item.barcode}</td>
                                                    <td className="py-3 font-medium min-w-[200px]">{item.nama}</td>
                                                    <td className="py-3 text-center">{item.stok_minimal}</td>
                                                    <td className="py-3 text-center text-error font-bold">{item.jumlah}</td>
                                                    <td className="py-3 text-center">{item.rak}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-5 text-center text-base-content/50 italic">
                                                    No data available in table
                                                </td>
                                            </tr>
                                        )}
                                        {/* {Array.from({ length: 10 }, (_, index) => (
                                            <tr key={index} className="border-b border-base-200 last:border-none">
                                                <td className="py-3 font-mono text-sm text-center">{index}</td>
                                                <td className="py-3 font-medium">cek</td>
                                                <td className="py-3 text-center">cek</td>
                                                <td className="py-3 text-center">cek</td>
                                            </tr>
                                        ))} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Expired Alerts */}
                        <div className="bg-base-100 border border-base-300 rounded-xl p-5">
                            <div className="flex items-center gap-3 mb-4 text-error">
                                <div className="p-2 bg-error/10 rounded-xl">
                                    <CalendarX size={20} />
                                </div>
                                <h2 className="font-bold text-lg text-base-content">Barang Kedaluwarsa</h2>
                            </div>
                            <div className="overflow-x-auto max-h-[250px] overflow-y-auto">
                                <table className="table w-full text-sm table-pin-rows">
                                    <thead>
                                        <tr className="border-b border-base-300 text-center text-base-content/60">
                                            <th className="pb-2">Nama Barang</th>
                                            <th className="pb-2">Jumlah</th>
                                            <th className="pb-2">Rak</th>
                                            <th className="pb-2">Tgl Kadaluwarsa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listExpired.length > 0 ? (
                                            listExpired.map((item, idx) => (
                                                <tr key={idx} className="border-b border-base-200 last:border-none">
                                                    <td className="py-3 font-medium min-w-[200px]">
                                                        <div>{item.nama}</div>
                                                        <span className="text-xs text-base-content/40 font-mono">{item.barcode}</span>
                                                    </td>
                                                    <td className="py-3 text-center">{item.jumlah}</td>
                                                    <td className="py-3 text-center">{item.rak}</td>
                                                    <td className="py-3 text-center text-error font-bold">{moment(item.expiredDate).format("YYYY-MM-DD")}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-5 text-center text-base-content/50 italic">
                                                    No data available in table
                                                </td>
                                            </tr>
                                        )}
                                        {/* {Array.from({ length: 10 }, (_, index) => (
                                            <tr key={index} className="border-b border-base-200 last:border-none">
                                                <td className="py-3 font-mono text-sm text-center">{index}</td>
                                                <td className="py-3 font-medium">cek</td>
                                                <td className="py-3 text-center">cek</td>
                                                <td className="py-3 text-center">cek</td>
                                            </tr>
                                        ))} */}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    {/* Populer Items */}
                    <div className="bg-base-100 border border-base-300 rounded-xl p-5 h-fit">
                        <div className="flex items-center gap-3 mb-5 text-orange-500">
                            <div className="p-2 bg-orange-500/10 rounded-xl">
                                <Flame size={20} />
                            </div>
                            <h2 className="font-bold text-lg text-base-content">Item Terpopuler</h2>
                        </div>
                        <div className="flex flex-col gap-4">
                            {listPopuler.length > 0 ? (
                                listPopuler.map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-3">
                                        <div className="flex justify-between text-sm font-medium">
                                            <span className="text-base-content/80">{idx + 1}. {item.nama}</span>
                                            <span className="font-bold text-primary">{item.total} Terjual</span>
                                        </div>
                                        <div className="w-full bg-base-200 h-2 rounded-full overflow-hidden">
                                            <div 
                                                className="bg-primary h-full rounded-full" 
                                                style={{ width: `${Math.min((item.total / 100) * 100, 100)}%` }} 
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5 text-base-content/50 italic text-sm">
                                    No data available
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
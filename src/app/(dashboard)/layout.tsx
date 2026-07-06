import Navbar from "@/src/components/common/Navbar";
import Sidebar from "@/src/components/common/sidebar/Sidebar";
import TabBarMobile from "@/src/components/common/TabBarMobile";
import { SidebarProvider } from "@/src/context/SidebarContext";
import { getSession } from "@/src/lib/session";
import { ReactNode } from "react";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const session = await getSession();

    return (
        <SidebarProvider>
            <div className="flex flex-col md:flex-row h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-y-auto bg-base-200 mb-[65px] sm:mb-0">
                    <Navbar session={session} />
                    {children}
                </div>
                <div className="sm:hidden bg-red-500">
                    <TabBarMobile />
                </div>
            </div>
        </SidebarProvider>
    )
}
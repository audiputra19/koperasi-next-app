"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
    isMobileOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    
    const openSidebar = () => setIsMobileOpen(true);
    const closeSidebar = () => setIsMobileOpen(false);

    return (
        <SidebarContext.Provider value={{ isMobileOpen, openSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebarMobile() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebarMobile harus digunakan di dalam SidebarProvider");
    }
    return context;
}
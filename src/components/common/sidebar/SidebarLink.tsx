"use client";

import { useSidebarMobile } from "@/src/context/SidebarContext";
import { SidebarLinkProps } from "@/src/types/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ExtendedLinkProps extends SidebarLinkProps {
    isCollapsed: boolean;
}

export default function SidebarLink({ item, isCollapsed }: ExtendedLinkProps) {
    const pathname = usePathname();
    const { closeSidebar } = useSidebarMobile();
    const isActive = pathname === item.path;
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        if (!isCollapsed || !wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 10 });
        setShowTooltip(true);
    };

    const handleMouseLeave = () => setShowTooltip(false);

    return (
        <div
            ref={wrapperRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={item.path}
                onClick={() => {
                    if (window.innerWidth < 768) {
                        closeSidebar();
                    }
                }}
                className={clsx(
                    "flex items-center rounded-lg text-sm font-semibold px-3 py-2.5",
                    isActive
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300 text-base-content"
                )}
            >
                <div className={clsx("flex items-center layout-container", !isCollapsed && "gap-5")}>
                    <span className={clsx("shrink-0 block",
                        isActive ? "text-primary-content" : (isCollapsed ? "text-base-content" : "text-gray-400")
                    )}>
                        {item.icon}
                    </span>

                    <span className={clsx(
                        "truncate origin-left overflow-hidden transition-all duration-300 ease-in-out",
                        isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                    )}>
                        {item.name}
                    </span>
                </div>
            </Link>

            {isCollapsed && showTooltip && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed z-[9999] px-2.5 py-1.5 rounded-md bg-neutral text-neutral-content text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none"
                    style={{ top: tooltipPos.top, left: tooltipPos.left, transform: "translateY(-50%)" }}
                >
                    {item.name}
                </div>,
                document.body
            )}
        </div>
    )
}
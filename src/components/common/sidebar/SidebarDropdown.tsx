"use client";

import { useSidebarMobile } from "@/src/context/SidebarContext";
import { SidebarDropdownProps } from "@/src/types/sidebar";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ExtendedDropdownProps extends SidebarDropdownProps {
    isCollapsed: boolean;
}

export default function SidebarDropdown({ item, isCollapsed }: ExtendedDropdownProps) {
    const pathname = usePathname();
    const { closeSidebar } = useSidebarMobile();
    const isChildActive = item.subMenu?.some((sub) => pathname === sub.path) ?? false;
    const [isOpen, setIsOpen] = useState<boolean>(() => isChildActive);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);

    const isDropdownOpen = !isCollapsed && isOpen;

    const handleMouseEnter = () => {
        if (!isCollapsed || !wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 10 });
        setShowTooltip(true);
    };

    const handleMouseLeave = () => setShowTooltip(false);

    return (
        <div className="w-full">
            <div
                ref={wrapperRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    onClick={() => !isCollapsed && setIsOpen(!isOpen)}
                    disabled={isCollapsed}
                    className={clsx(
                        "w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold relative justify-between",
                        isChildActive && !isOpen ? "bg-base-300 text-primary" : "hover:bg-base-300 text-base-content"
                    )}
                >
                    <div className={clsx("flex items-center layout-container", !isCollapsed && "gap-5")}>
                        <span className={clsx("shrink-0 block",
                            isChildActive ? "text-primary" : (isCollapsed ? "text-base-content" : "text-gray-400")
                        )}>
                            {item.icon}
                        </span>

                        <span className={clsx(
                            "truncate text-left",
                            isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible",
                            isChildActive && "text-primary font-bold"
                        )}>
                            {item.name}
                        </span>
                    </div>

                    <ChevronDown
                        size={16}
                        className={clsx(
                            "shrink-0",
                            isChildActive ? "text-primary" : "text-gray-400",
                            isOpen && !isCollapsed ? 'rotate-180' : '',
                            isCollapsed ? "opacity-0 invisible w-0" : "opacity-100 visible w-auto"
                        )}
                    />
                </button>
            </div>

            {isCollapsed && showTooltip && typeof document !== "undefined" && createPortal(
                <div
                    className="fixed z-[9999] px-2.5 py-1.5 rounded-md bg-neutral text-neutral-content text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none"
                    style={{ top: tooltipPos.top, left: tooltipPos.left, transform: "translateY(-50%)" }}
                >
                    {item.name}
                </div>,
                document.body
            )}

            <div
                className={clsx(
                    "border-l-2 border-base-300 ml-5.5 pl-5 space-y-1 transition-all duration-300 overflow-hidden",
                    isDropdownOpen ? 'max-h-40 opacity-100 py-1 visible' : 'max-h-0 opacity-0 py-0 invisible'
                )}
            >
                {item.subMenu?.map((sub) => {
                    const isSubActive = pathname === sub.path;

                    return (
                        <Link
                            key={sub.id}
                            href={sub.path}
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    closeSidebar();
                                }
                            }}
                            className={clsx(
                                "block px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                                isSubActive
                                    ? "bg-primary text-primary-content"
                                    : "text-gray-400 hover:bg-base-300"
                            )}
                        >
                            {sub.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}
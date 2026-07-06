import { useSidebarMobile } from "@/src/context/SidebarContext";
import { SidebarLinkProps } from "@/src/types/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ExtendedLinkProps extends SidebarLinkProps {
    isCollapsed: boolean;
}

export default function SidebarLink({ item, isCollapsed }: ExtendedLinkProps) {
    const pathname = usePathname();
    const { closeSidebar } = useSidebarMobile();
    const isActive = pathname === item.path;

    return (
        <div
            className={clsx(isCollapsed && "tooltip tooltip-right")}
            data-tip={item.name}
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
                    isCollapsed ? 'justify-center' : '',
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
                        "truncate origin-left",
                        isCollapsed ? "w-0 opacity-0 invisible" : "w-auto opacity-100 visible"
                    )}>
                        {item.name}
                    </span>
                </div>
            </Link>
        </div>
    )
}
import { ReactNode } from "react";

export interface MenuItem {
    id: string;
    name: string;
    icon: ReactNode;
    path: string;
}

export interface SidebarLinkProps {
    item: MenuItem
}

export interface SubMenuItem {
    id: string;
    name: string;
    path: string;
}

export interface MenuItemWithDropdown {
    id: string;
    name: string;
    icon: ReactNode;
    path?: string;
    subMenu?: SubMenuItem[];
}

export type SidebarMenuItem = MenuItem | MenuItemWithDropdown;

export interface SidebarDropdownProps {
    item: MenuItemWithDropdown;
}
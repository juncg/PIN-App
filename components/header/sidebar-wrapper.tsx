"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui-custom/sidebar";

export function SidebarWrapper() {
	const currentRoute = usePathname();

	return currentRoute != "/" && <SidebarTrigger />;
}

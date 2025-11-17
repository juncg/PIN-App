"use client";

import { Building, Hand, Home, Settings, Shield, ShoppingBag, Tag, User, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

const items = [
	{
		title: "Inicio",
		url: "/home",
		icon: Home,
	},
	{
		title: "Ofertas",
		url: "/offers",
		icon: Tag,
	},
	{
		title: "Peticiones",
		url: "/petitions",
		icon: Hand,
	},
	{
		title: "Productos",
		url: "/products",
		icon: ShoppingBag,
	},
	{
		title: "Empresas",
		url: "/businesses",
		icon: Building,
	},
	{
		title: "Foros",
		url: "/forums",
		icon: Users,
	},
];

if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
	items.push({
		title: "Security Tests",
		url: "/security-test",
		icon: Shield,
	});
}


const settingsItems = [
	{
		title: "Perfil",
		url: "/profile",
		icon: User,
	},
	{
		title: "Configuración",
		url: "/settings",
		icon: Settings,
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	const { setOpenMobile, setOpen } = useSidebar();
	const prevPathnameRef = useRef(pathname);

	useEffect(() => {
		if (prevPathnameRef.current !== pathname) {
			setOpenMobile(false);
			setOpen(false);
			prevPathnameRef.current = pathname;
		}
	}, [pathname, setOpenMobile, setOpen]);

	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Deal&Buy</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => {
								const isActive = pathname === item.url;
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={isActive}>
											<Link
												href={item.url}
												className={
													isActive
														? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
														: ""
												}
											>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					{settingsItems.map((item) => {
						const isActive = pathname === item.url;
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link
										href={item.url}
										className={
											isActive
												? "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
												: ""
										}
									>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

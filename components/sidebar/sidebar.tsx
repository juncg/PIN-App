import { Building, Hand, Home, Settings, ShoppingBag, Tag, User } from "lucide-react";
import Link from "next/link";

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
];

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
	return (
		<Sidebar className="bg-background">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Deal&Buy</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					{settingsItems.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}

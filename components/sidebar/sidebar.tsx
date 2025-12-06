"use client";

import { useUser } from "@/hooks/use-user";
import { Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui-custom/sidebar";
import {
	ChatBubblesFilledIcon,
	ChatBubblesIcon,
	DealBuyLogoIcon,
	FrameFilledIcon,
	FrameIcon,
	HomeFilledIcon,
	HomeIcon,
	PersonCircleFilledIcon,
	PersonCircleOutlineIcon,
	Settings3FilledIcon,
	Settings3Icon,
	ShoppingBagFilledIcon,
	ShoppingBagIcon,
} from "../icons/icons";

const items = [
	{
		title: "Inicio",
		url: "/home",
		icon: HomeIcon,
		iconFilled: HomeFilledIcon,
	},
	{
		title: "Ofertas",
		url: "/offers",
		icon: DealBuyLogoIcon,
		iconFilled: DealBuyLogoIcon,
	},
	{
		title: "Peticiones",
		url: "/petitions",
		icon: DealBuyLogoIcon,
		iconFilled: DealBuyLogoIcon,
	},
	{
		title: "Productos",
		url: "/products",
		icon: ShoppingBagIcon,
		iconFilled: ShoppingBagFilledIcon,
	},
	{
		title: "Foros",
		url: "/forums",
		icon: FrameIcon,
		iconFilled: FrameFilledIcon,
	},
	{
		title: "Posts",
		url: "/posts",
		icon: ChatBubblesIcon,
		iconFilled: ChatBubblesFilledIcon,
	},
];

if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
	items.push({
		title: "Security Tests",
		url: "/security-test",
		icon: Shield,
	});
}

export function AppSidebar() {
	const pathname = usePathname();
	const { setOpenMobile, setOpen } = useSidebar();
	const { userUuid } = useUser();
	const prevPathnameRef = useRef(pathname);

	useEffect(() => {
		if (prevPathnameRef.current !== pathname) {
			setOpenMobile(false);
			setOpen(false);
			prevPathnameRef.current = pathname;
		}
	}, [pathname, setOpenMobile, setOpen]);

	const settingsItems = [
		{
			title: "Ajustes",
			url: "/settings",
			icon: Settings3Icon,
			iconFilled: Settings3FilledIcon,
		},
		{
			title: "Perfil",
			url: userUuid ? `/profile/${userUuid}` : "/profile",
			icon: PersonCircleOutlineIcon,
			iconFilled: PersonCircleFilledIcon,
		},
	];

	return (
		<Sidebar className="border-none" collapsible="icon">
			<SidebarContent className="m-1.5">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-2">
							{items.map((item) => {
								const isActive = pathname === item.url;
								const IconComponent = isActive ? item.iconFilled : item.icon;
								return (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton asChild isActive={isActive}>
											<Link
												href={item.url}
												className={
													isActive
														? "bg-black text-black hover:bg-black/90 font-semibold"
														: ""
												}
											>
												<IconComponent
													className={`!h-5 !w-5 ${isActive && "!text-chernobyl"}`}
												/>
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
			<SidebarFooter className="m-1.5">
				<SidebarMenu className="gap-2">
					{settingsItems.map((item) => {
						const isActive = pathname === item.url || pathname.startsWith(`/profile/${userUuid}`);
						const IconComponent = isActive ? item.iconFilled : item.icon;
						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link
										href={item.url}
										className={
											isActive ? "bg-black text-black hover:bg-black/90 font-semibold" : ""
										}
									>
										<IconComponent className={`!h-5 !w-5 ${isActive && "!text-chernobyl"}`} />
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

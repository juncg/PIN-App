"use client";

import { useUser } from "@/hooks/use-user";
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
	entrySidebarAnimation,
	handleSidebarElementMouseEnterAnimation,
	handleSidebarElementMouseLeaveAnimation,
} from "../animations/sidebar";
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
		title: "Ofertas y peticiones",
		url: "/posts",
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
		title: "Feed",
		url: "/feed",
		icon: ChatBubblesIcon,
		iconFilled: ChatBubblesFilledIcon,
	},
];

export function AppSidebar() {
	const pathname = usePathname();
	const { setOpenMobile, setOpen, open } = useSidebar();
	const { userUuid } = useUser();
	const prevPathnameRef = useRef(pathname);
	const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);
	const footerItemsRef = useRef<(HTMLLIElement | null)[]>([]);
	const sidebarRef = useRef<HTMLDivElement>(null);

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

	useEffect(() => {
		if (prevPathnameRef.current !== pathname) {
			setOpenMobile(false);
			setOpen(false);
			prevPathnameRef.current = pathname;
		}
	}, [pathname, setOpenMobile, setOpen]);

	entrySidebarAnimation(menuItemsRef, footerItemsRef, sidebarRef);

	return (
		<Sidebar className="!border-none" collapsible="icon" ref={sidebarRef}>
			<SidebarContent className="m-1.5">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu className="gap-2">
							{items.map((item, index) => {
								const isActive = pathname === item.url;
								const IconComponent = isActive ? item.iconFilled : item.icon;
								return (
									<SidebarMenuItem
										key={item.title}
										ref={(el) => {
											menuItemsRef.current[index] = el;
										}}
									>
										<SidebarMenuButton asChild isActive={isActive}>
											<Link
												href={item.url}
												onMouseEnter={handleSidebarElementMouseEnterAnimation}
												onMouseLeave={handleSidebarElementMouseLeaveAnimation}
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
					{settingsItems.map((item, index) => {
						const isActive =
							item.title === "Perfil"
								? pathname === item.url || pathname.startsWith(`/profile/${userUuid}`)
								: pathname === item.url;
						const IconComponent = isActive ? item.iconFilled : item.icon;
						return (
							<SidebarMenuItem
								key={item.title}
								ref={(el) => {
									footerItemsRef.current[index] = el;
								}}
							>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link
										href={item.url}
										onMouseEnter={handleSidebarElementMouseEnterAnimation}
										onMouseLeave={handleSidebarElementMouseLeaveAnimation}
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

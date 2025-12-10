"use client";

import { useState } from "react";
import { Plus, Hand, Tag, MessageSquare, ShoppingBagIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui-custom/button";
import { cn } from "@/lib/utils";

type CreateOption = "offer" | "petition" | "forum" | "product";

interface CreatePostFabProps {
	isBusinessUser: boolean;
	enabledOptions?: CreateOption[];
}

interface OptionConfig {
	type: CreateOption;
	label: string;
	icon: typeof Hand;
	href: string;
	requiresBusiness: boolean;
}

const OPTIONS: OptionConfig[] = [
	{
		type: "forum",
		label: "Crear foro",
		icon: MessageSquare,
		href: "/forums/create",
		requiresBusiness: true,
	},
	{
		type: "offer",
		label: "Crear oferta",
		icon: Tag,
		href: "/offers/create",
		requiresBusiness: true,
	},
	{
		type: "petition",
		label: "Crear petición",
		icon: Hand,
		href: "/petitions/create",
		requiresBusiness: false,
	},
	{
		type: "product",
		label: "Crear producto",
		icon: ShoppingBagIcon,
		href: "/products/create",
		requiresBusiness: true,
	},
];

export function CreateFab({ isBusinessUser, enabledOptions = ["offer", "petition", "forum"] }: CreatePostFabProps) {
	const [isOpen, setIsOpen] = useState(false);

	const availableOptions = OPTIONS.filter(
		(option) => enabledOptions.includes(option.type) && (!option.requiresBusiness || isBusinessUser)
	);

	return (
		<div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
			<div
				className={cn(
					"flex flex-col gap-2 transition-all duration-300 ease-out items-end",
					isOpen
						? "opacity-100 translate-y-0 scale-100"
						: "opacity-0 translate-y-4 scale-95 pointer-events-none"
				)}
			>
				{availableOptions.map((option) => {
					const Icon = option.icon;
					return (
						<Link key={option.type} href={option.href}>
							<Button
								size="lg"
								className="bg-hover border border-cardborder text-white hover:bg-white hover:text-black hover:border-white shadow-xl hover:shadow-2xl transition-all duration-200 gap-2 min-w-[180px]"
								onClick={() => setIsOpen(false)}
							>
								<Icon className="h-5 w-5" />
								{option.label}
							</Button>
						</Link>
					);
				})}
			</div>

			<Button
				className={cn(
					"h-16 w-16 rounded-full bg-chernobyl text-black hover:bg-chernobyl/90 shadow-2xl hover:shadow-chernobyl/20 transition-all duration-300 border-0",
					isOpen && "rotate-45 scale-110"
				)}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Plus className="h-10 w-10" />
			</Button>
		</div>
	);
}

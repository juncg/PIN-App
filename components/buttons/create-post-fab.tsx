"use client";

import { useState } from "react";
import { Plus, Hand, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui-custom/button";
import { cn } from "@/lib/utils";

interface CreatePostFabProps {
	isBusinessUser: boolean;
}

export function CreatePostFab({ isBusinessUser }: CreatePostFabProps) {
	const [isOpen, setIsOpen] = useState(false);

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
				{isBusinessUser && (
					<Link href="/offers/create">
						<Button
							size="lg"
							className="bg-hover border border-cardborder text-white hover:bg-white hover:text-black hover:border-white shadow-xl hover:shadow-2xl transition-all duration-200 gap-2 min-w-[180px]"
							onClick={() => setIsOpen(false)}
						>
							<Tag className="h-5 w-5" />
							Crear oferta
						</Button>
					</Link>
				)}
				<Link href="/petitions/create">
					<Button
						size="lg"
						className="bg-hover border border-cardborder text-white hover:bg-white hover:text-black hover:border-white shadow-xl hover:shadow-2xl transition-all duration-200 gap-2 min-w-[180px]"
						onClick={() => setIsOpen(false)}
					>
						<Hand className="h-5 w-5" />
						Crear petición
					</Button>
				</Link>
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

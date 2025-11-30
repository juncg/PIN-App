"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui-custom/button";
import { Infinity, Tag, Hand } from "lucide-react";
import { cn } from "@/lib/utils";

export function PostTypeFilter() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const currentType = searchParams.get("type") || "all";

	const updateTypeFilter = (type: "all" | "offer" | "petition") => {
		const params = new URLSearchParams(searchParams.toString());

		if (type === "all") {
			params.delete("type");
		} else {
			params.set("type", type);
		}

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div className="flex gap-2">
			<Button
				variant="outline"
				size="sm"
				className={cn(
					"rounded-full px-6 border-2",
					currentType === "all"
						? "bg-chernobyl border-chernobyl text-black hover:bg-chernobyl/90"
						: "bg-black border-white text-white hover:bg-hover"
				)}
				onClick={() => updateTypeFilter("all")}
				disabled={isPending}
			>
				Todo
				<Infinity className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				className={cn(
					"rounded-full px-6 border-2",
					currentType === "offer"
						? "bg-chernobyl border-chernobyl text-black hover:bg-chernobyl/90"
						: "bg-black border-white text-white hover:bg-hover"
				)}
				onClick={() => updateTypeFilter("offer")}
				disabled={isPending}
			>
				Ofertas
				<Tag className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				className={cn(
					"rounded-full px-6 border-2",
					currentType === "petition"
						? "bg-chernobyl border-chernobyl text-black hover:bg-chernobyl/90"
						: "bg-black border-white text-white hover:bg-hover"
				)}
				onClick={() => updateTypeFilter("petition")}
				disabled={isPending}
			>
				Peticiones
				<Hand className=" h-4 w-4" />
			</Button>
		</div>
	);
}

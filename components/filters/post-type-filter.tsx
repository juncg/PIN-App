"use client";

import { Hand, Infinity, Tag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui-custom/button";

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
				variant={currentType === "all" ? "chernobyl" : "outline"}
				size="sm"
				onClick={() => updateTypeFilter("all")}
				disabled={isPending}
			>
				Todo
				<Infinity className="h-4 w-4" />
			</Button>
			<Button
				variant={currentType === "offer" ? "chernobyl" : "outline"}
				size="sm"
				onClick={() => updateTypeFilter("offer")}
				disabled={isPending}
			>
				Ofertas
				<Tag className="h-4 w-4" />
			</Button>
			<Button
				variant={currentType === "petition" ? "chernobyl" : "outline"}
				size="sm"
				onClick={() => updateTypeFilter("petition")}
				disabled={isPending}
			>
				Peticiones
				<Hand className=" h-4 w-4" />
			</Button>
		</div>
	);
}

"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button } from "../ui/button";

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
				variant={currentType === "all" ? "default" : "outline"}
				size="sm"
				className="rounded-full px-6"
				onClick={() => updateTypeFilter("all")}
				disabled={isPending}
			>
				Todo
			</Button>
			<Button
				variant={currentType === "offer" ? "default" : "outline"}
				size="sm"
				className="rounded-full px-6"
				onClick={() => updateTypeFilter("offer")}
				disabled={isPending}
			>
				Ofertas
			</Button>
			<Button
				variant={currentType === "petition" ? "default" : "outline"}
				size="sm"
				className="rounded-full px-6"
				onClick={() => updateTypeFilter("petition")}
				disabled={isPending}
			>
				Peticiones
			</Button>
		</div>
	);
}

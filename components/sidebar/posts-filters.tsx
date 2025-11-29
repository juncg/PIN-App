"use client";

import { useState, useTransition } from "react";
import { Label } from "../ui-custom/label";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PostsFiltersProps {}

const creatorOptions = [
	{ id: "1", name: "Usuario" },
	{ id: "2", name: "Empresa" },
	{ id: "3", name: "Empresa verificada" },
	{ id: "4", name: "Seguidos" },
];

const categoriesOptions = [
	{ id: "1", name: "Categoría 1" },
	{ id: "2", name: "Categoría 2" },
	{ id: "3", name: "Categoría 3" },
	{ id: "4", name: "Categoría 4" },
];

export default function PostsFilters({}: PostsFiltersProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const minPrice = Number(searchParams.get("minPrice")) || 0;
	const maxPrice = Number(searchParams.get("maxPrice")) || 10000;

	const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
	const [isPending, startTransition] = useTransition();

	const updatePriceFilters = () => {
		const params = new URLSearchParams(searchParams.toString());

		if (priceRange[0] > 0) {
			params.set("minPrice", priceRange[0].toString());
		} else {
			params.delete("minPrice");
		}

		if (priceRange[1] < 10000) {
			params.set("maxPrice", priceRange[1].toString());
		} else {
			params.delete("maxPrice");
		}

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div className="space-y-8">
			<div className="space-y-3">
				<h3 className="font-semibold text-foreground">Creador.</h3>
				<div className="space-y-3">
					{creatorOptions.map((option) => (
						<Button key={option.id} variant="outline" size="sm" className="rounded-full px-4">
							{option.name}
						</Button>
					))}
				</div>
			</div>

			<div className="space-y-3">
				<h3 className="font-semibold text-foreground">Categorías.</h3>
				<div className="space-y-3">
					{categoriesOptions.map((option) => (
						<Button key={option.id} variant="outline" size="sm" className="rounded-full px-4">
							{option.name}
						</Button>
					))}
				</div>
			</div>

			<div className="space-y-4">
				<div>
					<Label className="text-base font-bold">Precio.</Label>
					<div className="mt-6 px-2">
						<Slider
							value={priceRange}
							onValueChange={setPriceRange}
							onValueCommit={updatePriceFilters}
							max={10000}
							step={100}
							className="w-full"
							disabled={isPending}
						/>
					</div>
					<div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
						<span>{priceRange[0].toFixed(2)}€</span>
						<span>{priceRange[1].toFixed(2)}€</span>
					</div>
				</div>
			</div>
		</div>
	);
}

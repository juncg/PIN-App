"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { ICategory } from "@/lib/services/types";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

interface ProductsFiltersProps {
	categories: ICategory[];
}

export default function ProductsFilters({ categories }: ProductsFiltersProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const minPrice = Number(searchParams.get("minPrice")) || 0;
	const maxPrice = Number(searchParams.get("maxPrice")) || 10000;
	const categoriesParam = searchParams.get("categories");
	const minRating = Number(searchParams.get("minRating")) || 0;

	const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		categoriesParam ? categoriesParam.split(",") : []
	);
	const [selectedRating, setSelectedRating] = useState<number>(minRating);

	const hasActiveFilters =
		priceRange[0] > 0 || priceRange[1] < 10000 || selectedCategories.length > 0 || selectedRating > 0;

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (selectedCategories.length > 0) {
			params.set("categories", selectedCategories.join(","));
		} else {
			params.delete("categories");
		}

		if (selectedRating > 0) {
			params.set("minRating", selectedRating.toString());
		} else {
			params.delete("minRating");
		}

		if (params.toString() !== searchParams.toString() && !isPending) {
			startTransition(() => {
				router.push(`${pathname}?${params.toString()}`, { scroll: false });
			});
		}
	}, [selectedCategories, selectedRating]);

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

	const clearFilters = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("minPrice");
		params.delete("maxPrice");
		params.delete("categories");
		params.delete("minRating");

		setSelectedCategories([]);
		setPriceRange([0, 10000]);
		setSelectedRating(0);

		startTransition(() => {
			router.push(`${pathname}?${params.toString()}`, { scroll: false });
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">Filtros</h3>
				{hasActiveFilters && (
					<Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
						Limpiar
					</Button>
				)}
			</div>

			<div className="space-y-4">
				<div>
					<Label className="text-sm font-medium">Rango de precio</Label>
					<div className="mt-4 px-2">
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
						<span>${priceRange[0]}</span>
						<span>${priceRange[1]}</span>
					</div>
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<Label className="text-sm font-medium">Categorías</Label>
				<div className="space-y-2">
					{categories.map((category) => (
						<div key={category.id} className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Checkbox
									id={category.id.toString()}
									checked={selectedCategories.includes(category.id.toString())}
									disabled={isPending}
									onCheckedChange={(checked) => {
										const newCategories = checked
											? [...selectedCategories, category.id.toString()]
											: selectedCategories.filter((c) => c !== category.id.toString());
										setSelectedCategories(newCategories);
									}}
								/>
								<label
									htmlFor={category.id.toString()}
									className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
								>
									{category.name}
								</label>
							</div>
						</div>
					))}
				</div>
			</div>

			<Separator />

			<div className="space-y-3">
				<Label className="text-sm font-medium">Valoración</Label>
				<div className="space-y-2">
					{[5, 4, 3, 2, 1].map((rating) => (
						<div key={rating} className="flex items-center space-x-2">
							<Checkbox
								id={`rating-${rating}`}
								checked={selectedRating === rating}
								disabled={isPending}
								onCheckedChange={(checked) => {
									setSelectedRating(checked ? rating : 0);
								}}
							/>
							<label
								htmlFor={`rating-${rating}`}
								className="text-sm leading-none cursor-pointer flex items-center gap-1"
							>
								<span className="text-yellow-500">{"★".repeat(rating)}</span>
								<span className="text-muted-foreground">{"★".repeat(5 - rating)}</span>
								{rating < 5 && <span className="text-muted-foreground ml-1">y más</span>}{" "}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

"use client";

import { ICategory } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";

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
		<div className="space-y-8">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<Label className="text-base font-bold">Categorías.</Label>
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="sm"
							onClick={clearFilters}
							disabled={isPending}
							className="h-auto p-0 text-xs text-muted hover:text-white"
						>
							Limpiar filtros
						</Button>
					)}
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant={selectedCategories.length === 0 ? "default" : "outline"}
						size="sm"
						className="rounded-full px-4"
						onClick={() => setSelectedCategories([])}
					>
						Todo
					</Button>
					{categories.map((category) => {
						const isSelected = selectedCategories.includes(category.id.toString());
						return (
							<Button
								key={category.id}
								variant={isSelected ? "default" : "outline"}
								size="sm"
								className="rounded-full px-4"
								onClick={() => {
									const newCategories = isSelected
										? selectedCategories.filter((c) => c !== category.id.toString())
										: [...selectedCategories, category.id.toString()];
									setSelectedCategories(newCategories);
								}}
							>
								{category.name}
							</Button>
						);
					})}
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
					<div className="mt-2 flex items-center justify-between text-sm text-muted">
						<span>{priceRange[0].toFixed(2)}€</span>
						<span>{priceRange[1].toFixed(2)}€</span>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<Label className="text-base font-bold">Valoración.</Label>
				<div className="space-y-3">
					{[5, 4, 3, 2, 1].map((rating) => (
						<div key={rating} className="flex items-center space-x-3">
							<Checkbox
								id={`rating-${rating}`}
								checked={selectedRating === rating}
								disabled={isPending}
								onCheckedChange={(checked) => {
									setSelectedRating(checked ? rating : 0);
								}}
								className="h-5 w-5 rounded-sm border-muted/50 data-[state=checked]:bg-black data-[state=checked]:text-black"
							/>
							<label
								htmlFor={`rating-${rating}`}
								className="text-sm leading-none cursor-pointer flex items-center gap-1"
							>
								<div className="flex">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={cn(
												"h-4 w-4",
												i < rating ? "fill-black text-black" : "fill-muted text-muted"
											)}
										/>
									))}
								</div>
								{rating < 5 && <span className="text-muted ml-1 text-xs">y más</span>}
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

"use client";

import { ICategory } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Button } from "../ui-custom/button";
import { Checkbox } from "../ui-custom/checkbox";
import { Slider } from "../ui-custom/slider";
import { B1, B5 } from "../ui-custom/typography";

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

	const handleWheel = (e: React.WheelEvent) => {
		e.stopPropagation();
	};

	return (
		<div className="space-y-8" onWheel={handleWheel}>
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<B1>Categorías.</B1>
					{hasActiveFilters && (
						<Button variant="ghost" size="sm" onClick={clearFilters} disabled={isPending}>
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
					<B1>Precio.</B1>
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

					<div className="mt-2 flex items-center justify-between">
						<B5>{priceRange[0].toFixed(2)}€</B5>
						<B5>{priceRange[1].toFixed(2)}€</B5>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<B1>Valoración.</B1>
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
								className="h-5 w-5 rounded-sm border-lightgrey/50 data-[state=checked]:bg-black data-[state=checked]:text-black"
							/>

							<span className="flex items-center gap-2">
								<div className="flex">
									{Array.from({ length: 5 }).map((_, i) => (
										<Star
											key={i}
											className={cn(
												"h-4 w-4",
												i < rating ? "fill-white text-white" : " text-lightgrey"
											)}
										/>
									))}
								</div>

								{rating < 5 && <B5>y más</B5>}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { ICategory } from "@/lib/services/types";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

interface ProductsFiltersProps {
	categories: ICategory[];
}

export default function ProductsFilters({ categories }: ProductsFiltersProps) {
	const [priceRange, setPriceRange] = useState([0, 10000]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 10000 || selectedCategories.length > 0;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold">Filtros</h3>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={() => {
							setSelectedCategories([]);
							setPriceRange([0, 10000]);
						}}
					>
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
							max={10000}
							step={100}
							className="w-full"
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
									id={category.id.toLocaleString()}
									checked={selectedCategories.includes(category.id.toLocaleString())}
									onCheckedChange={(checked) => {
										if (checked) {
											setSelectedCategories([
												...selectedCategories,
												category.id.toLocaleString(),
											]);
										} else {
											setSelectedCategories(
												selectedCategories.filter((c) => c !== category.id.toLocaleString())
											);
										}
									}}
								/>
								<label
									htmlFor={category.id.toLocaleString()}
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
							<Checkbox id={`rating-${rating}`} />
							<label
								htmlFor={`rating-${rating}`}
								className="text-sm leading-none cursor-pointer flex items-center gap-1"
							>
								<span className="text-yellow-500">{"★".repeat(rating)}</span>
								<span className="text-muted-foreground">{"★".repeat(5 - rating)}</span>
								<span className="text-muted-foreground ml-1">y más</span>
							</label>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ICategory } from "@/lib/services/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui-custom/carousel";

interface CategoriesCarouselProps {
	categories: ICategory[];
}

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const categoriesParam = searchParams.get("categories");
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		categoriesParam ? categoriesParam.split(",") : []
	);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		if (selectedCategories.length > 0) {
			params.set("categories", selectedCategories.join(","));
		} else {
			params.delete("categories");
		}

		if (params.toString() !== searchParams.toString() && !isPending) {
			startTransition(() => {
				router.push(`${pathname}?${params.toString()}`, { scroll: false });
			});
		}
	}, [selectedCategories, pathname, router, searchParams, isPending]);

	const toggleCategory = (categoryId: string) => {
		const isSelected = selectedCategories.includes(categoryId);
		const newCategories = isSelected
			? selectedCategories.filter((c) => c !== categoryId)
			: [...selectedCategories, categoryId];
		setSelectedCategories(newCategories);
	};

	return (
		<Carousel
			opts={{
				align: "start",
				loop: false,
			}}
			className="w-full"
		>
			<CarouselContent className="-ml-2 md:-ml-4">
				<CarouselItem className="pl-2 md:pl-4 basis-auto">
					<Button
						variant={selectedCategories.length === 0 ? "default" : "outline"}
						size="sm"
						className="rounded-full px-6"
						onClick={() => setSelectedCategories([])}
						disabled={isPending}
					>
						Todas
					</Button>
				</CarouselItem>
				{categories.map((category) => {
					const isSelected = selectedCategories.includes(category.id.toString());
					return (
						<CarouselItem key={category.id} className="pl-2 md:pl-4 basis-auto">
							<Button
								variant={isSelected ? "default" : "outline"}
								size="sm"
								className="rounded-full px-6 whitespace-nowrap"
								onClick={() => toggleCategory(category.id.toString())}
								disabled={isPending}
							>
								{category.name}
							</Button>
						</CarouselItem>
					);
				})}
			</CarouselContent>
			<CarouselPrevious className="hidden md:flex" />
			<CarouselNext className="hidden md:flex" />
		</Carousel>
	);
}

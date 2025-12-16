"use client";

import { SearchIcon } from "@/components/icons/icons";
import { Card } from "@/components/ui-custom/card";
import { Input } from "@/components/ui-custom/input";
import { B1 } from "@/components/ui-custom/typography";
import { IProduct } from "@/lib/services/types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SearchProductsService } from "./product-search-services";

interface ProductSearchProps {
	businessIds?: number[];
	onProductSelect: (product: IProduct) => void;
	className?: string;
	globalSearch?: boolean;
}

export function ProductSearch({ businessIds, onProductSelect, className, globalSearch = false }: ProductSearchProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [results, setResults] = useState<IProduct[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	function handleSearch(value: string) {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		setIsLoading(true);
		setIsOpen(true);

		debounceTimerRef.current = setTimeout(async () => {
			try {
				const products = await SearchProductsService(value, globalSearch ? undefined : businessIds);
				setResults(products);
			} catch (error) {
				console.error("Error searching products:", error);
				setResults([]);
			} finally {
				setIsLoading(false);
			}
		}, 300);
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setSearchQuery(value);
		handleSearch(value);
	}

	function handleFocus() {
		if (!searchQuery && results.length === 0) {
			handleSearch("");
		} else {
			setIsOpen(true);
		}
	}

	const handleSelect = (product: IProduct) => {
		onProductSelect(product);
		setSearchQuery("");
		setResults([]);
		setIsOpen(false);
	};

	return (
		<div className={`relative ${className}`} ref={containerRef}>
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lightgrey" />
				<Input
					type="search"
					placeholder="Buscar productos..."
					className="pl-9 w-full border border-cardborder"
					onChange={handleChange}
					onFocus={handleFocus}
					value={searchQuery}
					disabled={!globalSearch && (!businessIds || businessIds.length === 0)}
				/>
			</div>

			{isOpen && (
				<Card className="absolute top-full mt-2 w-full max-h-60 overflow-y-auto z-50 shadow-lg">
					{isLoading ? (
						<div className="flex items-center justify-center p-4">
							<Loader2 className="h-6 w-6 animate-spin text-lightgrey" />
						</div>
					) : results.length > 0 ? (
						<div className="divide-y">
							{results.map((product) => (
								<div
									key={product.id}
									className="p-3 hover:bg-lightgrey/10 cursor-pointer transition-colors"
									onClick={() => handleSelect(product)}
								>
									<div className="flex justify-between items-center">
										<span className="font-medium">{product.name}</span>
										<span className="text-primary font-semibold">
											{product.msrp?.toFixed(2) || "0.00"}€
										</span>
									</div>
									{product.description && (
										<B1 className="text-lightgrey text-sm truncate">{product.description}</B1>
									)}
								</div>
							))}
						</div>
					) : (
						<div className="p-4 text-center">
							<B1 className="text-lightgrey">No se encontraron productos</B1>
						</div>
					)}
				</Card>
			)}
		</div>
	);
}

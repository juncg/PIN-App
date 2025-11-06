"use client";

import { ISearchParams } from "@/types";
import { ProductDetails } from "@/components/products/product-details";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	return (
		<div>
			<ProductDetails />
		</div>
	);
}

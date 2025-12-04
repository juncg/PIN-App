"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IProduct } from "@/lib/services/types";

export async function SearchProductsService(searchQuery: string, businessIds?: number[]) {
	
	const limit = 10;
	
	const filters: any[] = [
		{ method: "range", from: 0, to: limit - 1 },
	];

	if (businessIds) {
		if (businessIds.length === 0) return [];
		filters.push({ method: "in", column: "Product_Business.business_id", value: businessIds });
	}

	if (searchQuery) {
		filters.push({ method: "ilike", column: "name", value: `%${searchQuery}%` });
	}

	const select = businessIds 
		? `*, Product_Business!inner(business_id)` 
		: `*`;

	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: select,
		filters: filters,
	});

	return products || [];
}

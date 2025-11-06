import { GetFromDatabase } from "@/lib/services/general";
import { IProduct } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/lib/constants";

export async function ProductDetailsServices(id: number) {
	const { data: product } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [
			{ method: "eq", column: "id", value: id },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	return { product: product?.[0] || null };
}

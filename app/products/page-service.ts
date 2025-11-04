import { GetFromDatabase } from "@/lib/services/general";
import { IProduct } from "@/lib/services/types";

export async function ProductServices() {

	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [{ method: "order", column: "created_at", ascending: false }],
	});

    return { products };
}
import { GetFromDatabase } from "@/lib/services/general";
import { IForum, IProduct } from "@/lib/services/types";

interface CreatePetitionServicesResult {
	forums: any;
	tags: any;
	initialProduct: IProduct | null;
}

export async function CreatePetitionServices(productId?: string): Promise<CreatePetitionServicesResult> {
	const forums = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*",
	});

	const tags = await GetFromDatabase<{ id: number; name: string }>({
		tableName: "Tag",
		select: "*",
	});

	let initialProduct: IProduct | null = null;
	if (productId) {
		const productIdNum = parseInt(productId);
		if (!isNaN(productIdNum)) {
			const { data: product } = await GetFromDatabase<IProduct>({
				tableName: "Product",
				select: "*, businesses:Product_Business!inner(business:Business(*))",
				filters: [
					{ method: "eq", column: "id", value: productIdNum },
				],
			});
			initialProduct = product?.[0] || null;
		}
	}

	return { forums, tags, initialProduct };
}
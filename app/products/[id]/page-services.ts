import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, IReview, IOffer, IPetition } from "@/lib/services/types";

export async function ProductDetailsServices(id: number) {
	const { data: product } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [
			{ method: "eq", column: "id", value: id },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	const { data: productReviews, error: reviewsError } = await GetFromDatabase<IReview>({
		tableName: "Review",
		select: "*, user:User!Review_creator_id_fkey(*), User_Review!left(liked, user_id), Review_Product!inner(product_id)",
		filters: [
			{ method: "eq", column: "Review_Product.product_id", value: id },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	const numOfReviews = productReviews?.length || 0;

	const { data: relatedProducts } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [
			{ method: "neq", column: "id", value: id },
			{ method: "order", column: "created_at", ascending: false },
			{ method: "limit", value: 5 },
		],
	});

	const { data: relatedOffers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: "*, forum:Forum!inner(Business(*))",
		filters: [
			{ method: "contains", column: "product_ids", value: [id] },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	const { data: relatedPetitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: "*, forum:Forum!inner(Business(*))",
		filters: [
			{ method: "contains", column: "product_ids", value: [id] },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	const { data: numOfRelatedOffers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: "id",
		filters: [{ method: "contains", column: "product_ids", value: [id] }],
	});

	const { data: numOfRelatedPetitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: "id",
		filters: [{ method: "contains", column: "product_ids", value: [id] }],
	});

	const { data: businessProducts } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [
			{ method: "neq", column: "id", value: id },
			{
				method: "eq",
				column: "Product_Business.business_id",
				value: product?.[0]?.businesses?.[0]?.business?.id || 0,
			},
			{ method: "order", column: "created_at", ascending: false },
			{ method: "limit", value: 5 },
		],
	});

	return {
		product: product?.[0] || null,
		numOfReviews: numOfReviews || 0,
		productReviews: productReviews || [],
		relatedProducts: relatedProducts || [],
		relatedOffers: relatedOffers || [],
		relatedPetitions: relatedPetitions || [],
		numOfRelatedOffers: numOfRelatedOffers?.length || 0,
		numOfRelatedPetitions: numOfRelatedPetitions?.length || 0,
		businessProducts: businessProducts || [],
	};
}

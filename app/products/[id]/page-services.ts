import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, IReview } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { ExecuteRpcFunction } from "@/lib/services/general";

export interface RatingDistribution {
	stars: number;
	count: number;
	percentage: number;
}

function createDefaultDistribution(): RatingDistribution[] {
	return [
		{ stars: 5, count: 0, percentage: 0 },
		{ stars: 4, count: 0, percentage: 0 },
		{ stars: 3, count: 0, percentage: 0 },
		{ stars: 2, count: 0, percentage: 0 },
		{ stars: 1, count: 0, percentage: 0 },
	];
}

async function GetProductRatingDistribution(productId: number): Promise<RatingDistribution[]> {
	const { data, error } = await ExecuteRpcFunction<RatingDistribution>({
		functionName: "get_product_rating_distribution",
		params: {
			product_id_input: productId,
		},
	});

	if (error || !data) {
		return createDefaultDistribution();
	}

	return data.map((item) => ({
		...item,
		percentage: parseFloat(item.percentage as any),
	}));
}

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
		select: "*, user:User!Review_creator_id_fkey(*), Review_Product!inner(product_id)",
		filters: [
			{ method: "eq", column: "Review_Product.product_id", value: id },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	const ratingDistribution = await GetProductRatingDistribution(id);

	const numOfReviews = ratingDistribution.reduce((total, item) => total + item.count, 0);

	return {
		product: product?.[0] || null,
		ratingDistribution,
		numOfReviews: numOfReviews || 0,
		productReviews: productReviews || [],
	};
}

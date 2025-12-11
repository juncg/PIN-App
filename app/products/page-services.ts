import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, ICategory } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";

export async function ProductServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "products" });
	const currentUserId = await getUserUuid();

	const orderBy = params.orderBy || "newest";
	let orderColumn = "created_at";
	let ascending = false;

	switch (orderBy) {
		case "oldest":
			orderColumn = "created_at";
			ascending = true;
			break;
		case "price_low_high":
			orderColumn = "msrp";
			ascending = true;
			break;
		case "price_high_low":
			orderColumn = "msrp";
			ascending = false;
			break;
		case "rating_low_high":
			orderColumn = "rating";
			ascending = true;
			break;
		case "rating_high_low":
			orderColumn = "rating";
			ascending = false;
			break;
		default:
			orderColumn = "created_at";
			ascending = false;
	}

	const filters: any[] = [{ method: "order", column: orderColumn, ascending }];

	const minPrice = params.minPrice ? Number(params.minPrice) : null;
	const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

	if (minPrice !== null && minPrice > 0) {
		filters.push({ method: "gte", column: "msrp", value: minPrice });
	}

	if (maxPrice !== null && maxPrice < 10000) {
		filters.push({ method: "lte", column: "msrp", value: maxPrice });
	}

	const minRating = params.minRating ? Number(params.minRating) : null;
	if (minRating !== null && minRating > 0) {
		filters.push({ method: "gte", column: "rating", value: minRating });
	}

	let selectQuery = "*, businesses:Product_Business!inner(business:Business(*)), Review_Product(review_id)";

	if (params.categories) {
		const categoryIds = params.categories.split(",").map(Number);
		selectQuery += ", Product_Category!inner(category_id)";
		filters.push({ method: "in", column: "Product_Category.category_id", value: categoryIds });
	}

	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: selectQuery,
		filters,
	});

	const { data: categories } = await GetFromDatabase<ICategory>({
		tableName: "Category",
		select: "*",
		filters: [{ method: "order", column: "name", ascending: true }],
	});

	const userBusinesses = await GetFromDatabase<{ business_id: number }>({
		tableName: "User_Business",
		select: "business_id",
		filters: [{ method: "eq", column: "user_id", value: currentUserId }],
	});

	const isBusinessUser = userBusinesses.data !== null && userBusinesses.data.length > 0;

	const clientTranslations = {
		sort_by: translator("sort_by"),
		newest: translator("newest"),
		oldest: translator("oldest"),
		price_low_high: translator("price_low_high"),
		price_high_low: translator("price_high_low"),
		rating_low_high: translator("rating_low_high"),
		rating_high_low: translator("rating_high_low"),
	};

	return { products, categories, translator, clientTranslations, currentUserId, isBusinessUser };
}

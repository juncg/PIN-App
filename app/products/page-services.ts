import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, ICategory } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";
import { DEFAULT_LOCALE } from "@/lib/constants";

export async function ProductServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "products" });

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

	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [{ method: "order", column: orderColumn, ascending }],
	});

	const { data: categories } = await GetFromDatabase<ICategory>({
		tableName: "Category",
		select: "*",
		filters: [{ method: "order", column: "name", ascending: true }],
	});

	const clientTranslations = {
		sort_by: translator("sort_by"),
		newest: translator("newest"),
		oldest: translator("oldest"),
		price_low_high: translator("price_low_high"),
		price_high_low: translator("price_high_low"),
		rating_low_high: translator("rating_low_high"),
		rating_high_low: translator("rating_high_low"),
	};

	return { products, categories, translator, clientTranslations };
}

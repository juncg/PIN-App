import { GetFromDatabase } from "@/lib/services/general";
import { IProduct } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";
import { DEFAULT_LOCALE } from "@/lib/constants";

export async function ProductServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "products" });

	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
		filters: [{ method: "order", column: "created_at", ascending: false }],
	});

	return { products, translator };
}

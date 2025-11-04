import { DEFAULT_LOCALE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { SearchParams } from "../types";

export async function BusinessesServices(searchParams: Promise<SearchParams>) {
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "businesses" });

	const { data: businesses } = await GetFromDatabase<IBusiness>({ tableName: "Business", select: "*" });

	return { translator, businesses };
}

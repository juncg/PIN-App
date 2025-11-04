import { DEFAULT_LOCALE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";

export async function OfferServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "offers" });

	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
		filters: params.postName
			? [
					{
						method: "ilike",
						column: "title",
						value: `%${params.postName}%`,
					},
			  ]
			: [],
	});

	return { translator, offers };
}

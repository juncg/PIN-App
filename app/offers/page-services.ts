import { DEFAULT_LOCALE, OFFERS_PAGE_SIZE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";

async function fetchOffers(page: number = 0, pageSize: number = OFFERS_PAGE_SIZE, postName: string = "") {
	const from = page * pageSize;
	const to = from + pageSize - 1;

	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name)), User!Offer_creator_id_fkey(*)`,
		filters: [
			{
				method: "range",
				from: from,
				to: to,
			},
			{
				method: "ilike",
				column: "title",
				value: `%${postName}%`,
			},
		],
	});

	offers?.map((offer: IOffer) => {
		offer.type = "Offer";
	});

	return offers || [];
}

export async function OfferServices(searchParams: Promise<ISearchParams>) {
	const uuid = await getUserUuid();

	const userBusinesses = await GetFromDatabase<{ business_id: number }>({
		tableName: "User_Business",
		select: "business_id",
		filters: [{ method: "eq", column: "user_id", value: uuid }],
	});

	const isBusinessUser = userBusinesses.data !== null && userBusinesses.data.length > 0;
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "offers" });

	const offers = await fetchOffers(0, OFFERS_PAGE_SIZE, params.postName || "");

	return { translator, offers, isBusinessUser };
}

export async function LoadMoreOffers(page: number, pageSize: number, postName: string = "") {
	"use server";
	return await fetchOffers(page, pageSize, postName);
}

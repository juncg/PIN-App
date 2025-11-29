import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, ICategory, IOffer, IPetition } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";
import { DEFAULT_LOCALE, OFFERS_PAGE_SIZE, PETITIONS_PAGE_SIZE } from "@/lib/constants";

async function fetchOffers(page: number = 0, pageSize: number = OFFERS_PAGE_SIZE) {
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
		],
	});

	offers?.map((offer: IOffer) => {
		offer.type = "Offer";
	});

	return offers || [];
}

async function fetchPetitions(page: number = 0, pageSize: number = PETITIONS_PAGE_SIZE) {
	const from = page * pageSize;
	const to = from + pageSize - 1;

	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User!Petition_creator_id_fkey(*)`,
		filters: [
			{
				method: "range",
				from: from,
				to: to,
			},
		],
	});

	petitions?.map((petition: IPetition) => {
		petition.type = "Petition";
	});

	return petitions || [];
}

export async function PostsServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const postType = params.type || "all";
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "products" });

	const clientTranslations = {
		sort_by: translator("sort_by"),
		newest: translator("newest"),
		oldest: translator("oldest"),
		price_low_high: translator("price_low_high"),
		price_high_low: translator("price_high_low"),
		rating_low_high: translator("rating_low_high"),
		rating_high_low: translator("rating_high_low"),
	};

	const offers = postType === "petition" ? [] : await fetchOffers(0, OFFERS_PAGE_SIZE);
	const petitions = postType === "offer" ? [] : await fetchPetitions(0, PETITIONS_PAGE_SIZE);

	// Combine and sort by creation date
	const allPosts = [...offers, ...petitions].sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	return { translator, clientTranslations, posts: allPosts, postType };
}

export async function LoadMorePetitions(page: number, pageSize: number, postName: string = "") {
	"use server";
	return await fetchPetitions(page, pageSize);
}

export async function LoadMoreOffers(page: number, pageSize: number) {
	"use server";
	return await fetchOffers(page, pageSize);
}

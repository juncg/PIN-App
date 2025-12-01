import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, ICategory, IOffer, IPetition, ITag } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";
import { DEFAULT_LOCALE, OFFERS_PAGE_SIZE, PETITIONS_PAGE_SIZE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";

async function fetchOffers(
	creatorFilter?: "user" | "business" | "verified_business" | "followed",
	currentUserId?: string | null,
	tagFilter?: string,
	orderColumn: string = "created_at",
	ascending: boolean = false
) {
	const filters: any[] = [{ method: "order", column: orderColumn, ascending }];

	let select = `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name)), User!Offer_creator_id_fkey(*)`;

	if (tagFilter) {
		const tagIds = tagFilter.split(",").map(Number);
		const { data: offerTags } = await GetFromDatabase({
			tableName: "Offer_Tag",
			select: "offer_id",
			filters: [{ method: "in", column: "tag_id", value: tagIds }],
		});

		if (offerTags && offerTags.length > 0) {
			const uniqueOfferIds = [...new Set(offerTags.map((ot: any) => ot.offer_id))];
			filters.push({ method: "in", column: "id", value: uniqueOfferIds });
		} else {
			return [];
		}
	}

	if (creatorFilter === "user") {
		select += `, Forum!inner(business_id)`;
		filters.push({ method: "is", column: "Forum.business_id", value: null });
	} else if (creatorFilter === "business" || creatorFilter === "verified_business") {
		select += `, Forum!inner(business_id, Business!inner(*))`;
		filters.push({ method: "not.is", column: "Forum.business_id", value: null });

		if (creatorFilter === "verified_business") {
			filters.push({ method: "in", column: "Forum.Business.verification", value: ["Official", "Paid"] });
		}
	} else if (creatorFilter === "followed" && currentUserId) {
		// por ahora solo followed forums
		select += `, Forum!inner(business_id, User_Forum!inner(user_id))`;
		filters.push({ method: "eq", column: "Forum.User_Forum.user_id", value: currentUserId });
	}

	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: select,
		filters: filters,
	});

	offers?.map((offer: IOffer) => {
		offer.type = "Offer";
	});

	return offers || [];
}

async function fetchPetitions(
	creatorFilter?: "user" | "business" | "verified_business" | "followed",
	currentUserId?: string | null,
	tagFilter?: string,
	orderColumn: string = "created_at",
	ascending: boolean = false
) {
	const filters: any[] = [{ method: "order", column: orderColumn, ascending }];

	let select = `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User!Petition_creator_id_fkey(*)`;

	if (tagFilter) {
		const tagIds = tagFilter.split(",").map(Number);
		const { data: petitionTags } = await GetFromDatabase({
			tableName: "Petition_Tag",
			select: "petition_id",
			filters: [{ method: "in", column: "tag_id", value: tagIds }],
		});

		if (petitionTags && petitionTags.length > 0) {
			const uniquePetitionIds = [...new Set(petitionTags.map((pt: any) => pt.petition_id))];
			filters.push({ method: "in", column: "id", value: uniquePetitionIds });
		} else {
			return [];
		}
	}

	if (creatorFilter === "user") {
		select += `, Forum!inner(business_id)`;
		filters.push({ method: "is", column: "Forum.business_id", value: null });
	} else if (creatorFilter === "business" || creatorFilter === "verified_business") {
		select += `, Forum!inner(business_id, Business!inner(*))`;
		filters.push({ method: "not.is", column: "Forum.business_id", value: null });

		if (creatorFilter === "verified_business") {
			filters.push({ method: "in", column: "Forum.Business.verification", value: ["Official", "Paid"] });
		}
	} else if (creatorFilter === "followed" && currentUserId) {
		// por ahora solo followed forums
		select += `, Forum!inner(business_id, User_Forum!inner(user_id))`;
		filters.push({ method: "eq", column: "Forum.User_Forum.user_id", value: currentUserId });
	}

	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: select,
		filters: filters,
	});

	petitions?.map((petition: IPetition) => {
		petition.type = "Petition";
	});

	return petitions || [];
}

export async function PostsServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const postType = params.type || "all";
	const creatorFilter = params.creator;
	const tagFilter = params.tags;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "products" });

	const currentUserId = creatorFilter === "followed" ? await getUserUuid() : null;

	const orderBy = params.orderBy || "newest";
	let orderColumn = "created_at";
	let ascending = false;

	switch (orderBy) {
		case "oldest":
			orderColumn = "created_at";
			ascending = true;
			break;
		case "price_low_high":
			orderColumn = "current_fee";
			ascending = true;
			break;
		case "price_high_low":
			orderColumn = "current_fee";
			ascending = false;
			break;
		default:
			orderColumn = "created_at";
			ascending = false;
	}

	const clientTranslations = {
		sort_by: translator("sort_by"),
		newest: translator("newest"),
		oldest: translator("oldest"),
		price_low_high: translator("price_low_high"),
		price_high_low: translator("price_high_low"),
		rating_low_high: translator("rating_low_high"),
		rating_high_low: translator("rating_high_low"),
	};

	const offers =
		postType === "petition"
			? []
			: await fetchOffers(creatorFilter, currentUserId, tagFilter, orderColumn, ascending);
	const petitions =
		postType === "offer"
			? []
			: await fetchPetitions(creatorFilter, currentUserId, tagFilter, orderColumn, ascending);

	// Combine offers and petitions (already sorted by database)
	const allPosts = [...offers, ...petitions].sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	const popularTags = await GetFromDatabase<ITag>({
		tableName: "Tag",
		select: "*",
		filters: [
			{
				method: "order",
				column: "times_used",
				ascending: false,
			},
			{
				method: "range",
				from: 0,
				to: 9,
			},
		],
	});

	return {
		translator,
		clientTranslations,
		posts: allPosts,
		postType,
		popularTags: popularTags.data || [],
		currentUserId,
	};
}

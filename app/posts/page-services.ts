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
	ascending: boolean = false,
	followedUserIds?: string[],
	followedForumIds?: number[],
	minPrice?: number | null,
	maxPrice?: number | null
) {
	const filters: any[] = [{ method: "order", column: orderColumn, ascending }];

	if (minPrice !== undefined && minPrice !== null && minPrice > 0) {
		filters.push({ method: "gte", column: "reduced_price", value: minPrice });
	}

	if (maxPrice !== undefined && maxPrice !== null && maxPrice < 10000) {
		filters.push({ method: "lte", column: "reduced_price", value: maxPrice });
	}

	if (orderColumn === "reduced_price") {
		filters.push({ method: "not", column: "reduced_price", operator: "is", value: null });
	}

	let select = `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name)), User!Offer_creator_id_fkey(*), products:Offer_Product(Product(*))`;

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
		filters.push({ method: "not", column: "Forum.business_id", operator: "is", value: null });

		if (creatorFilter === "verified_business") {
			filters.push({ method: "in", column: "Forum.Business.verification", value: ["Official", "Paid"] });
		}
	} else if (creatorFilter === "followed" && currentUserId) {
		const orConditions: string[] = [];
		if (followedUserIds && followedUserIds.length > 0) {
			orConditions.push(`creator_id.in.(${followedUserIds.join(",")})`);
		}
		if (followedForumIds && followedForumIds.length > 0) {
			orConditions.push(`forum_id.in.(${followedForumIds.join(",")})`);
		}

		if (orConditions.length > 0) {
			filters.push({ method: "or", value: orConditions.join(",") });
			select += `, Forum(*)`;
		} else {
			return [];
		}
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
	ascending: boolean = false,
	followedUserIds?: string[],
	followedForumIds?: number[],
	minPrice?: number | null,
	maxPrice?: number | null
) {
	const filters: any[] = [{ method: "order", column: orderColumn, ascending }];

	if (minPrice !== undefined && minPrice !== null && minPrice > 0) {
		filters.push({ method: "gte", column: "reduced_price", value: minPrice });
	}

	if (maxPrice !== undefined && maxPrice !== null && maxPrice < 10000) {
		filters.push({ method: "lte", column: "reduced_price", value: maxPrice });
	}

	if (orderColumn === "reduced_price") {
		filters.push({ method: "not", column: "reduced_price", operator: "is", value: null });
	}

	let select = `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User!Petition_creator_id_fkey(*), products:Petition_Product(Product(*))`;

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
		filters.push({ method: "not", column: "Forum.business_id", operator: "is", value: null });

		if (creatorFilter === "verified_business") {
			filters.push({ method: "in", column: "Forum.Business.verification", value: ["Official", "Paid"] });
		}
	} else if (creatorFilter === "followed" && currentUserId) {
		const orConditions: string[] = [];
		if (followedUserIds && followedUserIds.length > 0) {
			orConditions.push(`creator_id.in.(${followedUserIds.join(",")})`);
		}
		if (followedForumIds && followedForumIds.length > 0) {
			orConditions.push(`forum_id.in.(${followedForumIds.join(",")})`);
		}

		if (orConditions.length > 0) {
			filters.push({ method: "or", value: orConditions.join(",") });
			select += `, Forum(*)`;
		} else {
			return [];
		}
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
	const minPrice = params.minPrice ? Number(params.minPrice) : null;
	const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;
	const currentUserId = await getUserUuid();
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
			orderColumn = "reduced_price";
			ascending = true;
			break;
		case "price_high_low":
			orderColumn = "reduced_price";
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

	let followedUserIds: string[] = [];
	let followedForumIds: number[] = [];

	if (creatorFilter === "followed" && currentUserId) {
		const { data: userFollows } = await GetFromDatabase({
			tableName: "User_User",
			select: "following_id",
			filters: [{ method: "eq", column: "user_id", value: currentUserId }],
		});
		if (userFollows) followedUserIds = userFollows.map((u: any) => u.following_id);

		const { data: forumFollows } = await GetFromDatabase({
			tableName: "User_Forum",
			select: "forum_id",
			filters: [{ method: "eq", column: "user_id", value: currentUserId }],
		});
		if (forumFollows) followedForumIds = forumFollows.map((f: any) => f.forum_id);
	}

	const offers =
		postType === "petition"
			? []
			: await fetchOffers(
					creatorFilter,
					currentUserId,
					tagFilter,
					orderColumn,
					ascending,
					followedUserIds,
					followedForumIds,
					minPrice,
					maxPrice
			  );
	const petitions =
		postType === "offer"
			? []
			: await fetchPetitions(
					creatorFilter,
					currentUserId,
					tagFilter,
					orderColumn,
					ascending,
					followedUserIds,
					followedForumIds,
					minPrice,
					maxPrice
			  );

	const allPosts = [...offers, ...petitions].sort((a, b) => {
		if (orderColumn === "reduced_price") {
			const priceA = a.reduced_price || 0;
			const priceB = b.reduced_price || 0;
			return ascending ? priceA - priceB : priceB - priceA;
		}
		const dateA = new Date(a.created_at).getTime();
		const dateB = new Date(b.created_at).getTime();
		return ascending ? dateA - dateB : dateB - dateA;
	});

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

	const userBusinesses = await GetFromDatabase<{ business_id: number }>({
		tableName: "User_Business",
		select: "business_id",
		filters: [{ method: "eq", column: "user_id", value: currentUserId }],
	});

	const isBusinessUser = userBusinesses.data !== null && userBusinesses.data.length > 0;

	return {
		translator,
		clientTranslations,
		posts: allPosts,
		postType,
		popularTags: popularTags.data || [],
		currentUserId,
		isBusinessUser,
	};
}

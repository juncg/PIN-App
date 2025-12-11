import { GetFromDatabase } from "@/lib/services/general";
import { IProduct, ICategory, IOffer, IPetition, ITag } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";
import { DEFAULT_LOCALE, OFFERS_PAGE_SIZE, PETITIONS_PAGE_SIZE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";

async function fetchPosts(
	type: 'offer' | 'petition',
	creatorFilter?: "user" | "business" | "verified_business" | "followed",
	currentUserId?: string | null,
	tagFilter?: string,
	orderColumn: string = "created_at",
	ascending: boolean = false,
	followedUserIds?: string[],
	followedForumIds?: number[],
	minPrice?: number | null,
	maxPrice?: number | null
): Promise<any[]> {
	const tableName = type === 'offer' ? 'Offer' : 'Petition';
	const userRelation = type === 'offer' ? 'User_Offer' : 'User_Petition';
	const tagRelation = type === 'offer' ? 'Offer_Tag' : 'Petition_Tag';
	const idColumn = type === 'offer' ? 'offer_id' : 'petition_id';
	const creatorFkey = type === 'offer' ? 'Offer_creator_id_fkey' : 'Petition_creator_id_fkey';
	const productRelation = type === 'offer' ? 'Offer_Product' : 'Petition_Product';
	const postType = type === 'offer' ? 'Offer' : 'Petition';

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

	let select = `*, ${userRelation}!left(liked, subscribed, user_id), tags:${tagRelation}(Tag(name)), User!${creatorFkey}(*), products:${productRelation}(Product(*))`;

	if (tagFilter) {
		const tagIds = tagFilter.split(",").map(Number);
		const { data: postTags } = await GetFromDatabase({
			tableName: tagRelation,
			select: idColumn,
			filters: [{ method: "in", column: "tag_id", value: tagIds }],
		});

		if (postTags && postTags.length > 0) {
			const uniqueIds = [...new Set(postTags.map((pt: any) => pt[idColumn]))];
			filters.push({ method: "in", column: "id", value: uniqueIds });
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

	const { data: posts } = await GetFromDatabase({
		tableName: tableName,
		select: select,
		filters: filters,
	});

	posts?.map((post: any) => {
		post.type = postType;
	});

	return posts || [];
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
			: (await fetchPosts(
					'offer',
					creatorFilter,
					currentUserId,
					tagFilter,
					orderColumn,
					ascending,
					followedUserIds,
					followedForumIds,
					minPrice,
					maxPrice
			  )) as IOffer[];
	const petitions =
		postType === "offer"
			? []
			: (await fetchPosts(
					'petition',
					creatorFilter,
					currentUserId,
					tagFilter,
					orderColumn,
					ascending,
					followedUserIds,
					followedForumIds,
					minPrice,
					maxPrice
			  )) as IPetition[];

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

	let isBusinessUser = false;

	if (currentUserId) {
		const userBusinesses = await GetFromDatabase<{ business_id: number }>({
			tableName: "User_Business",
			select: "business_id",
			filters: [{ method: "eq", column: "user_id", value: currentUserId }],
		});
		
		isBusinessUser = userBusinesses.data !== null && userBusinesses.data.length > 0;
	}

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

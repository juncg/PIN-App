import { GetClient, GetFromDatabase } from "@/lib/services/general";
import { ICategory, IForum, IProduct } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { getTranslations } from "next-intl/server";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { ISearchParams } from "@/types";

export async function ForumDetailsService(forumId: number, searchParams: Promise<ISearchParams>) {
	const uuid = await getUserUuid();

	const { data: forum } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `*, 
			Business!inner(*),
			Forum_Tag(Tag(id, name)),
			User_Forum!left(forum_id, user_id)`,
		filters: [
			{
				method: "eq",
				column: "id",
				value: forumId,
			},
		],
	});

	if (!forum || forum.length === 0) {
		return { forum: null, isFollowing: false, counts: { petitions: 0, offers: 0 } };
	}

	const { data: petitions } = await GetFromDatabase({
		tableName: "Petition",
		select: "id",
		filters: [
			{
				method: "eq",
				column: "forum_id",
				value: forumId,
			},
			{
				method: "eq",
				column: "state",
				value: "Posted",
			},
		],
	});

	const { data: offers } = await GetFromDatabase({
		tableName: "Offer",
		select: "id",
		filters: [
			{
				method: "eq",
				column: "forum_id",
				value: forumId,
			},
			{
				method: "eq",
				column: "state",
				value: "Posted",
			},
		],
	});

	const isFollowing = forum[0].User_Forum?.some((fu) => fu.user_id === uuid) || false;

	const { data: categories } = await GetFromDatabase<ICategory>({
		tableName: "Category",
		select: "*",
		filters: [{ method: "order", column: "name", ascending: true }],
	});

	const { data: popularForums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*, Business(*)",
		filters: [
			{ method: "order", column: "followers", ascending: false },
			{ method: "range", from: 0, to: 4 },
			{ method: "neq", column: "id", value: forumId },
		],
	});

	const { data: businessForums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*, Business(*)",
		filters: [
			{ method: "eq", column: "business_id", value: forum[0].business_id },
			{ method: "neq", column: "id", value: forumId },
			{ method: "order", column: "followers", ascending: false },
			{ method: "range", from: 0, to: 4 },
		],
	});

	const { data: businessProductsRaw } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, Product_Business!inner(Business(*))",
		filters: [
			{ method: "eq", column: "Product_Business.business_id", value: forum[0].business_id },
			{ method: "order", column: "created_at", ascending: false },
			{ method: "range", from: 0, to: 4 },
		],
	});

	const businessProducts = businessProductsRaw?.map((product: any) => ({
		...product,
		businesses: product.Product_Business ? [{ business: product.Product_Business.Business }] : [],
	})) || [];

	const { data: randomForums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*, Business(*)",
		filters: [
			{ method: "neq", column: "id", value: forumId },
			{ method: "order", column: "created_at", ascending: false },
			{ method: "range", from: 0, to: 5 },
		],
	});

	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "forums" });

	const clientTranslations = {
		followed: translator("followed"),
		follow: translator("follow"),
	};

	return {
		forum,
		isFollowing,
		counts: {
			petitions: petitions?.length || 0,
			offers: offers?.length || 0,
		},
		categories: categories || [],
		popularForums: popularForums || [],
		businessForums: businessForums || [],
		businessProducts: businessProducts || [],
		randomForums: randomForums || [],
		translator,
		clientTranslations,
	};
}

export async function fetchForumPosts(forumId: number, page: number = 0, pageSize: number = 10) {
	"use server";

	const from = page * pageSize;
	const to = from + pageSize - 1;

	// Get forum info for business data
	const { data: forum } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `*, Business!inner(id, name, description, verification)`,
		filters: [
			{
				method: "eq",
				column: "id",
				value: forumId,
			},
		],
	});

	const { data: offers } = await GetFromDatabase({
		tableName: "Offer",
		select: `*, 
			Offer_Tag(Tag(id, name)),
			User_Offer!left(liked, subscribed, user_id),
			User!Offer_creator_id_fkey(*)`,
		filters: [
			{
				method: "eq",
				column: "forum_id",
				value: forumId,
			},
			{
				method: "range",
				from: from,
				to: to,
			},
		],
	});

	const { data: petitions } = await GetFromDatabase({
		tableName: "Petition",
		select: `*, 
			Petition_Tag(Tag(id, name)),
			User_Petition!left(liked, subscribed, user_id),
			User!Petition_creator_id_fkey(*)`,
		filters: [
			{
				method: "eq",
				column: "forum_id",
				value: forumId,
			},
			{
				method: "range",
				from: from,
				to: to,
			},
		],
	});

	const forumOffers =
		offers?.map((offer: any) => ({
			...offer,
			type: "Offer" as const,
			businesses: forum && forum[0]?.Business ? [{ business: forum[0].Business }] : [],
			tags: offer.Offer_Tag?.map((ot: any) => ot.Tag),
		})) || [];

	const forumPetitions =
		petitions?.map((petition: any) => ({
			...petition,
			type: "Petition" as const,
			businesses: forum && forum[0]?.Business ? [{ business: forum[0].Business }] : [],
			tags: petition.Petition_Tag?.map((pt: any) => pt.Tag),
		})) || [];

	return {
		offers: forumOffers,
		petitions: forumPetitions,
	};
}

export async function loadMoreForumPosts(forumId: number, page: number, pageSize: number) {
	"use server";
	return fetchForumPosts(forumId, page, pageSize);
}

export async function loadMoreOffers(forumId: number, page: number, pageSize: number) {
	"use server";
	const result = await fetchForumPosts(forumId, page, pageSize);
	return result.offers;
}

export async function loadMorePetitions(forumId: number, page: number, pageSize: number) {
	"use server";
	const result = await fetchForumPosts(forumId, page, pageSize);
	return result.petitions;
}

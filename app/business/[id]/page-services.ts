import { DEFAULT_LOCALE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness, IForum, IOffer, IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { getTranslations } from "next-intl/server";

const POSTS_PER_PAGE = 10;

export async function BusinessProfileServices(businessId: number, searchParams: Promise<ISearchParams>) {
	const currentUserUuid = await getUserUuid();
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "business" });

	const clientTranslations = {
		followed: translator("followed"),
		follow: translator("follow"),
	};

	const { data: businessData } = await GetFromDatabase<IBusiness>({
		tableName: "Business",
		select: currentUserUuid ? "*, User_Business!inner(user_id)" : "*",
		filters: [{ method: "eq" as const, column: "id", value: businessId }],
	});

	const business = businessData?.[0] || null;

	if (!business) {
		return { business: null };
	}

	const isFollowing = currentUserUuid
		? (business.User_Business &&
				business.User_Business.length > 0 &&
				business.User_Business.some((ub) => ub.user_id === currentUserUuid)) ||
		  false
		: false;

	const { data: businessForums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `
            *, 
            User_Forum!left(forum_id, user_id), 
            Business(*), 
            Forum_Category!inner(category_id),
            Offer!left(id, state),
            Petition!left(id)
        `,
		filters: [
			{ method: "eq", column: "business_id", value: businessId },
			{ method: "order", column: "followers", ascending: false },
			{ method: "limit", value: 5 },
		],
	});

	const { data: similarBusinesses } = await GetFromDatabase<IBusiness>({
		tableName: "Business",
		select: "*",
		filters: [
			{ method: "neq", column: "id", value: businessId },
			{ method: "limit", value: 5 },
		],
	});

	const [offersResult, petitionsResult] = await Promise.all([
		fetchBusinessOffers(businessId),
		fetchBusinessPetitions(businessId),
	]);

	const allOffers = offersResult.data || [];
	const allPetitions = petitionsResult.data || [];

	const sortedOffers = allOffers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
	const sortedPetitions = allPetitions.sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	const initialOffers = sortedOffers.slice(0, POSTS_PER_PAGE);
	const initialPetitions = sortedPetitions.slice(0, POSTS_PER_PAGE);

	return {
		business,
		isFollowing,
		businessForums: businessForums || [],
		similarBusinesses: similarBusinesses || [],
		stats: {
			followers: business.followers,
			petitions: sortedPetitions.length,
			offers: sortedOffers.length,
		},
		initialPosts: {
			offers: initialOffers,
			petitions: initialPetitions,
		},
		clientTranslations,
	};
}

async function fetchBusinessOffers(businessId: number) {
	const { data: forumOffers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `
            *,
            tags:Offer_Tag(Tag(name)),
            User!Offer_creator_id_fkey(id, username, name, surnames, profile_picture),
            Forum!inner(business_id)
        `,
		filters: [
			{ method: "eq", column: "Forum.business_id", value: businessId },
			{ method: "eq", column: "state", value: "Posted" },
		],
	});

	const { data: productOffers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `
            *,
            tags:Offer_Tag(Tag(name)),
            User!Offer_creator_id_fkey(id, username, name, surnames, profile_picture),
            Offer_Product!inner(Product!inner(Product_Business!inner(business_id)))
        `,
		filters: [
			{ method: "eq", column: "Offer_Product.Product.Product_Business.business_id", value: businessId },
			{ method: "eq", column: "state", value: "Posted" },
		],
	});

	const mergedOffers = mergeAndDeduplicatePosts(forumOffers || [], productOffers || []);

	return { data: mergedOffers };
}

async function fetchBusinessPetitions(businessId: number) {
	const { data: forumPetitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `
            *,
            tags:Petition_Tag(Tag(name)),
            User!Petition_creator_id_fkey(id, username, name, surnames, profile_picture),
            Forum!inner(business_id)
        `,
		filters: [
			{ method: "eq", column: "Forum.business_id", value: businessId },
			{ method: "eq", column: "state", value: "Posted" },
		],
	});

	const { data: productPetitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `
            *,
            tags:Petition_Tag(Tag(name)),
            User!Petition_creator_id_fkey(id, username, name, surnames, profile_picture),
            Petition_Product!inner(Product!inner(Product_Business!inner(business_id)))
        `,
		filters: [
			{ method: "eq", column: "Petition_Product.Product.Product_Business.business_id", value: businessId },
			{ method: "eq", column: "state", value: "Posted" },
		],
	});

	const mergedPetitions = mergeAndDeduplicatePosts(forumPetitions || [], productPetitions || []);

	return { data: mergedPetitions };
}

/**
 * Merge two arrays and remove duplicates by ID
 */
function mergeAndDeduplicatePosts<T extends { id: number; created_at: string }>(list1: T[], list2: T[]): T[] {
	const map = new Map<number, T>();

	[...list1, ...list2].forEach((item) => {
		if (!map.has(item.id)) {
			map.set(item.id, item);
		}
	});

	return Array.from(map.values());
}

// Server Actions for pagination
export async function loadMoreBusinessOffers(businessId: number, page: number) {
	"use server";

	const { data: offers } = await fetchBusinessOffers(businessId);

	if (!offers) return [];

	// Sort by date
	const sortedOffers = offers.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

	// Return paginated slice
	const start = page * POSTS_PER_PAGE;
	const end = start + POSTS_PER_PAGE;

	return sortedOffers.slice(start, end);
}

export async function loadMoreBusinessPetitions(businessId: number, page: number) {
	"use server";

	const { data: petitions } = await fetchBusinessPetitions(businessId);

	if (!petitions) return [];

	// Sort by date
	const sortedPetitions = petitions.sort(
		(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
	);

	// Return paginated slice
	const start = page * POSTS_PER_PAGE;
	const end = start + POSTS_PER_PAGE;

	return sortedPetitions.slice(start, end);
}

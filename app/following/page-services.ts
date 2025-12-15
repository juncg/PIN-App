"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

const OFFER_SELECT =
	"*, User!Offer_creator_id_fkey(id, profile_picture, username), User_Offer!left(liked, subscribed, user_id), products:Offer_Product(Product(*))";
const PETITION_SELECT =
	"*, User!Petition_creator_id_fkey(id, profile_picture, username), User_Petition!left(liked, subscribed, user_id), products:Petition_Product(Product(*))";

type PostWithComments =
	| (IOffer & { type: "Offer"; comment_count: number })
	| (IPetition & { type: "Petition"; comment_count: number });

export async function FollowingPageServices() {
	const userUuid = await getUserUuid();

	if (!userUuid) {
		return { posts: [], businesses: [], forums: [], products: [] };
	}

	const [followedUsersResult, followedForumsResult, followedBusinessesResult] = await Promise.all([
		GetFromDatabase<{ following_id: string }>({
			tableName: "User_User",
			select: "following_id",
			filters: [{ method: "eq", column: "user_id", value: userUuid }],
		}),
		GetFromDatabase<{ forum_id: number }>({
			tableName: "User_Forum",
			select: "forum_id",
			filters: [{ method: "eq", column: "user_id", value: userUuid }],
		}),
		GetFromDatabase<{ business_id: number }>({
			tableName: "User_Business",
			select: "business_id",
			filters: [{ method: "eq", column: "user_id", value: userUuid }],
		}),
	]);

	const followedUserIds = followedUsersResult.data?.map((u) => u.following_id) || [];
	const followedForumIds = followedForumsResult.data?.map((f) => f.forum_id) || [];
	const followedBusinessIds = followedBusinessesResult.data?.map((b) => b.business_id) || [];

	if (followedUserIds.length === 0 && followedForumIds.length === 0 && followedBusinessIds.length === 0) {
		return { posts: [], businesses: [], forums: [], products: [] };
	}

	const offerPromises: Promise<{ data: IOffer[] | null; error: any }>[] = [];
	const petitionPromises: Promise<{ data: IPetition[] | null; error: any }>[] = [];

	if (followedUserIds.length > 0) {
		offerPromises.push(
			GetFromDatabase<IOffer>({
				tableName: "Offer",
				select: OFFER_SELECT,
				filters: [{ method: "in", column: "creator_id", value: followedUserIds }],
			})
		);
	}
	if (followedForumIds.length > 0) {
		offerPromises.push(
			GetFromDatabase<IOffer>({
				tableName: "Offer",
				select: OFFER_SELECT,
				filters: [{ method: "in", column: "forum_id", value: followedForumIds }],
			})
		);
	}
	if (followedBusinessIds.length > 0) {
		offerPromises.push(
			GetFromDatabase<IOffer>({
				tableName: "Offer",
				select: OFFER_SELECT,
				filters: [{ method: "in", column: "business_id", value: followedBusinessIds }],
			})
		);
	}

	if (followedUserIds.length > 0) {
		petitionPromises.push(
			GetFromDatabase<IPetition>({
				tableName: "Petition",
				select: PETITION_SELECT,
				filters: [{ method: "in", column: "creator_id", value: followedUserIds }],
			})
		);
	}
	if (followedForumIds.length > 0) {
		petitionPromises.push(
			GetFromDatabase<IPetition>({
				tableName: "Petition",
				select: PETITION_SELECT,
				filters: [{ method: "in", column: "forum_id", value: followedForumIds }],
			})
		);
	}

	const [offerResults, petitionResults] = await Promise.all([
		Promise.all(offerPromises),
		Promise.all(petitionPromises),
	]);

	const offerMap = new Map<number, IOffer>();
	const petitionMap = new Map<number, IPetition>();

	offerResults.forEach((result) => {
		result.data?.forEach((offer) => offerMap.set(offer.id, offer));
	});

	petitionResults.forEach((result) => {
		result.data?.forEach((petition) => petitionMap.set(petition.id, petition));
	});

	const uniqueOffers = Array.from(offerMap.values());
	const uniquePetitions = Array.from(petitionMap.values());

	const allPosts: PostWithComments[] = [
		...uniqueOffers.map((o) => ({ ...o, type: "Offer" as const, comment_count: 0 })),
		...uniquePetitions.map((p) => ({ ...p, type: "Petition" as const, comment_count: 0 })),
	];

	if (allPosts.length > 0) {
		const offerIds = allPosts.filter((p) => p.type === "Offer").map((p) => p.id);
		const petitionIds = allPosts.filter((p) => p.type === "Petition").map((p) => p.id);

		const commentPromises = [];

		if (offerIds.length > 0) {
			commentPromises.push(
				GetFromDatabase<{ offer_id: number }>({
					tableName: "Comment_Post",
					select: "offer_id",
					filters: [{ method: "in", column: "offer_id", value: offerIds }],
				})
			);
		}

		if (petitionIds.length > 0) {
			commentPromises.push(
				GetFromDatabase<{ petition_id: number }>({
					tableName: "Comment_Post",
					select: "petition_id",
					filters: [{ method: "in", column: "petition_id", value: petitionIds }],
				})
			);
		}

		const commentResults = await Promise.all(commentPromises);

		const commentCounts: { [id: number]: number } = {};
		commentResults.forEach((result) => {
			result.data?.forEach((comment) => {
				const id = "offer_id" in comment ? comment.offer_id : comment.petition_id;
				commentCounts[id] = (commentCounts[id] || 0) + 1;
			});
		});

		allPosts.forEach((post) => {
			post.comment_count = commentCounts[post.id] || 0;
		});
	}

	allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

	const [businessesResult, forumsResult, productsResult] = await Promise.all([
		followedBusinessIds.length > 0
			? GetFromDatabase({
					tableName: "Business",
					select: "id, name, username, profile_picture, verification",
					filters: [{ method: "in", column: "id", value: followedBusinessIds }],
			  })
			: Promise.resolve({ data: [] }),
		followedForumIds.length > 0
			? GetFromDatabase({
					tableName: "Forum",
					select: "id, name, profile_picture, Business(username, verification)",
					filters: [{ method: "in", column: "id", value: followedForumIds }],
			  })
			: Promise.resolve({ data: [] }),
		followedBusinessIds.length > 0
			? GetFromDatabase({
					tableName: "Product",
					select: "*, businesses:Product_Business!inner(business:Business(*))",
					filters: [{ method: "in", column: "Product_Business.business_id", value: followedBusinessIds }],
			  })
			: Promise.resolve({ data: [] }),
	]);

	return {
		posts: allPosts,
		businesses: businessesResult.data || [],
		forums: forumsResult.data || [],
		products: productsResult.data || [],
	};
}

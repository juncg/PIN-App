"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IReview } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function FeedServices() {
	const userUuid = await getUserUuid();

	if (!userUuid) {
		return { posts: [] };
	}

	const { data: followedUsers } = await GetFromDatabase<{ following_id: string }>({
		tableName: "User_User",
		select: "following_id",
		filters: [{ method: "eq", column: "user_id", value: userUuid }],
	});
	const followedUserIds = followedUsers?.map((u) => u.following_id) || [];

	const { data: followedForums } = await GetFromDatabase<{ forum_id: number }>({
		tableName: "User_Forum",
		select: "forum_id",
		filters: [{ method: "eq", column: "user_id", value: userUuid }],
	});
	const followedForumIds = followedForums?.map((f) => f.forum_id) || [];

	if (followedUserIds.length === 0 && followedForumIds.length === 0) {
		return { posts: [] };
	}

	const offerMap = new Map<number, IOffer>();
	if (followedUserIds.length > 0) {
		const { data: offersFromUsers } = await GetFromDatabase<IOffer>({
			tableName: "Offer",
			select: "*, User!Offer_creator_id_fkey(id, profile_picture, username), User_Offer!left(liked, subscribed, user_id), Offer_Product(Product(*))",
			filters: [{ method: "in", column: "creator_id", value: followedUserIds }],
		});
		(offersFromUsers || []).forEach(o => offerMap.set(o.id, o));
	}
	if (followedForumIds.length > 0) {
		const { data: offersFromForums } = await GetFromDatabase<IOffer>({
			tableName: "Offer",
			select: "*, User!Offer_creator_id_fkey(id, profile_picture, username), User_Offer!left(liked, subscribed, user_id), Offer_Product(Product(*))",
			filters: [{ method: "in", column: "forum_id", value: followedForumIds }],
		});
		(offersFromForums || []).forEach(o => offerMap.set(o.id, o));
	}
	const uniqueOffers = Array.from(offerMap.values());

	const petitionMap = new Map<number, IPetition>();
	if (followedUserIds.length > 0) {
		const { data: petitionsFromUsers } = await GetFromDatabase<IPetition>({
			tableName: "Petition",
			select: "*, User!Petition_creator_id_fkey(id, profile_picture, username), User_Petition!left(liked, subscribed, user_id), Petition_Product(Product(*))",
			filters: [{ method: "in", column: "creator_id", value: followedUserIds }],
		});
		(petitionsFromUsers || []).forEach(p => petitionMap.set(p.id, p));
	}
	if (followedForumIds.length > 0) {
		const { data: petitionsFromForums } = await GetFromDatabase<IPetition>({
			tableName: "Petition",
			select: "*, User!Petition_creator_id_fkey(id, profile_picture, username), User_Petition!left(liked, subscribed, user_id), Petition_Product(Product(*))",
			filters: [{ method: "in", column: "forum_id", value: followedForumIds }],
		});
		(petitionsFromForums || []).forEach(p => petitionMap.set(p.id, p));
	}
	const uniquePetitions = Array.from(petitionMap.values());

	const allPosts = [
		...uniqueOffers.map((o) => ({ ...o, type: "Offer" as const })),
		...uniquePetitions.map((p) => ({ ...p, type: "Petition" as const })),
	];

	const offerIds = allPosts.filter((p) => p.type === "Offer").map((p) => p.id);
	const petitionIds = allPosts.filter((p) => p.type === "Petition").map((p) => p.id);

	const commentCounts: { [id: number]: number } = {};

	if (offerIds.length > 0) {
		const { data: offerComments } = await GetFromDatabase<{ offer_id: number }>({
			tableName: "Comment_Post",
			select: "offer_id",
			filters: [{ method: "in", column: "offer_id", value: offerIds }],
		});
		offerComments?.forEach((c) => {
			commentCounts[c.offer_id] = (commentCounts[c.offer_id] || 0) + 1;
		});
	}

	if (petitionIds.length > 0) {
		const { data: petitionComments } = await GetFromDatabase<{ petition_id: number }>({
			tableName: "Comment_Post",
			select: "petition_id",
			filters: [{ method: "in", column: "petition_id", value: petitionIds }],
		});
		petitionComments?.forEach((c) => {
			commentCounts[c.petition_id] = (commentCounts[c.petition_id] || 0) + 1;
		});
	}

	allPosts.forEach((post) => {
		(post as any).comment_count = commentCounts[post.id] || 0;
	});

	allPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

	return { posts: allPosts };
}


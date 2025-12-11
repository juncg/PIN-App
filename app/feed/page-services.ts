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

	if (followedUserIds.length === 0) {
		return { posts: [] };
	}

	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: "*, User!Offer_creator_id_fkey(*), User_Offer!left(liked, subscribed, user_id), Offer_Product(Product(*))",
		filters: [{ method: "in", column: "creator_id", value: followedUserIds }],
	});

	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: "*, User!Petition_creator_id_fkey(*), User_Petition!left(liked, subscribed, user_id), Petition_Product(Product(*))",
		filters: [{ method: "in", column: "creator_id", value: followedUserIds }],
	});

	const allPosts = [
		...(offers || []).map((o) => ({ ...o, type: "Offer" as const })),
		...(petitions || []).map((p) => ({ ...p, type: "Petition" as const })),
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


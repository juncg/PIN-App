import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function ForumDetailsService(forumId: number) {
	const uuid = await getUserUuid();

	const { data: forum } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `*, 
			Business!inner(id, name, description, verification),
			Forum_Tag(Tag(id, name)),
			Forum_User!left(forum_id, user_id)`,
		filters: [
			{
				method: "eq",
				column: "id",
				value: forumId,
			},
		],
	});

	if (!forum || forum.length === 0) {
		return { forum: null, isFollowing: false };
	}

	const isFollowing = forum[0].Forum_User?.some((fu) => fu.user_id === uuid) || false;

	return { forum, isFollowing };
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
			User_Offer!left(liked, subscribed, user_id)`,
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
			User_Petition!left(liked, subscribed, user_id)`,
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

import { GetFromDatabase, GetServiceClient } from "@/lib/services/general";
import { IOffer, IPetition, IUser } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function ProfileServices(uuid: number) {
	const currentUserUuid = await getUserUuid();
	var followedByUser = false;

	const user = uuid
		? await GetFromDatabase<IUser>({
				tableName: "User",
				select: "*",
				filters: [{ method: "eq", column: "id", value: uuid }],
		  })
		: null;

	const userData = user?.data?.[0];
	console.log("User Data fetched in services: ", userData);

	const { data: followingForumsRaw } = await GetFromDatabase<any>({
		tableName: "User_Forum",
		select: "Forum(*)",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "forum_id", ascending: false },
			{ method: "range", from: 0, to: 2 },
		],
	});

	const followingForums = followingForumsRaw?.map((item) => item.Forum) || [];

	// Total forums count
	let followingForumsCount = 0;
	if (uuid) {
		const { supabase } = await GetServiceClient();
		const { count, error } = await supabase
			.from("User_Forum")
			.select("*", { count: "exact", head: true })
			.eq("user_id", uuid);
		if (!error && typeof count === "number") followingForumsCount = count;
	}

	const { data: followingBusinessesRaw } = await GetFromDatabase<any>({
		tableName: "User_Business",
		select: "Business(*)",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "business_id", ascending: false },
			{ method: "range", from: 0, to: 2 },
		],
	});

	const followingBusinesses = followingBusinessesRaw?.map((item) => item.Business) || [];

	// Total businesses count
	let followingBusinessesCount = 0;
	if (uuid) {
		const { supabase } = await GetServiceClient();
		const { count, error } = await supabase
			.from("User_Business")
			.select("*", { count: "exact", head: true })
			.eq("user_id", uuid);
		if (!error && typeof count === "number") followingBusinessesCount = count;
	}

	const { data: followingUsersRaw } = await GetFromDatabase<any>({
		tableName: "User_User",
		select: "User!User_User_following_id_fkey(*)",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "following_id", ascending: false },
			{ method: "range", from: 0, to: 2 },
		],
	});

	const followingUsers = followingUsersRaw?.map((item) => item.User) || [];

	// Total users count
	let followingUsersCount = 0;
	if (uuid) {
		const { supabase } = await GetServiceClient();
		const { count, error } = await supabase
			.from("User_User")
			.select("*", { count: "exact", head: true })
			.eq("user_id", uuid);
		if (!error && typeof count === "number") followingUsersCount = count;
	}

	const { data: subscribedOffersRaw } = await GetFromDatabase<any>({
		tableName: "User_Offer",
		select: "Offer(*, User!Offer_creator_id_fkey(*))",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "offer_id", ascending: false },
			{ method: "range", from: 0, to: 2 },
		],
	});

	const subscribedOffers = subscribedOffersRaw?.map((item) => item.Offer) || [];

	// Total subscribed offers count
	let subscribedOffersCount = 0;
	if (uuid) {
		const { supabase } = await GetServiceClient();
		const { count, error } = await supabase
			.from("User_Offer")
			.select("*", { count: "exact", head: true })
			.eq("user_id", uuid);
		if (!error && typeof count === "number") subscribedOffersCount = count;
	}

	const { data: subscribedPetitionsRaw } = await GetFromDatabase<any>({
		tableName: "User_Petition",
		select: "Petition(*, User!Petition_creator_id_fkey(*))",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "petition_id", ascending: false },
			{ method: "range", from: 0, to: 5 },
		],
	});

	const subscribedPetitions = subscribedPetitionsRaw?.map((item) => item.Petition) || [];

	// Total subscribed petitions count
	let subscribedPetitionsCount = 0;
	if (uuid) {
		const { supabase } = await GetServiceClient();
		const { count, error } = await supabase
			.from("User_Petition")
			.select("*", { count: "exact", head: true })
			.eq("user_id", uuid);
		if (!error && typeof count === "number") subscribedPetitionsCount = count;
	}

	if (userData && currentUserUuid) {
		const { data: isFollowingData } = await GetFromDatabase<any>({
			tableName: "User_User",
			filters: [
				{ method: "eq", column: "user_id", value: currentUserUuid },
				{ method: "eq", column: "following_id", value: userData.id },
			],
		});

		followedByUser = (isFollowingData && isFollowingData.length > 0) || false;
	}

	// Get total liked posts count
	const likedPostsCount = await getLikedPostsCount(uuid);

	return {
		userData,
		followingForums,
		followingForumsCount,
		followingBusinesses,
		followingBusinessesCount,
		followingUsers,
		followingUsersCount,
		subscribedOffers,
		subscribedOffersCount,
		subscribedPetitions,
		subscribedPetitionsCount,
		followedByUser,
		likedPostsCount,
	};
}

/**
 * Fetch user's created offers
 */
async function fetchUserOffers(userId: string | number) {
	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name)), User!Offer_creator_id_fkey(*)`,
		filters: [
			{ method: "eq", column: "creator_id", value: userId },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	offers?.map((offer: IOffer) => {
		offer.type = "Offer";
	});

	return offers || [];
}

/**
 * Fetch user's created petitions
 */
async function fetchUserPetitions(userId: string | number) {
	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User!Petition_creator_id_fkey(*)`,
		filters: [
			{ method: "eq", column: "creator_id", value: userId },
			{ method: "order", column: "created_at", ascending: false },
		],
	});

	petitions?.map((petition: IPetition) => {
		petition.type = "Petition";
	});

	return petitions || [];
}

/**
 * Get user's posts (offers and petitions) for "Mis publicaciones" section
 */
export async function getUserPosts(userId: string | number) {
	const offers = await fetchUserOffers(userId);
	const petitions = await fetchUserPetitions(userId);

	const allPosts = [...offers, ...petitions].sort((a, b) => {
		const dateA = new Date(a.created_at).getTime();
		const dateB = new Date(b.created_at).getTime();
		return dateB - dateA;
	});

	return {
		offers,
		petitions,
		allPosts,
		offersCount: offers.length,
		petitionsCount: petitions.length,
		totalCount: allPosts.length,
	};
}

/**
 * Get the total number of posts (offers, petitions, and reviews) that the user has liked
 */
export async function getLikedPostsCount(userId: string | number): Promise<number> {
	if (!userId) return 0;

	const { supabase } = await GetServiceClient();
	let totalLikes = 0;

	// Count liked offers
	const { count: offersCount, error: offersError } = await supabase
		.from("User_Offer")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("liked", true);

	if (!offersError && typeof offersCount === "number") {
		totalLikes += offersCount;
	}

	// Count liked petitions
	const { count: petitionsCount, error: petitionsError } = await supabase
		.from("User_Petition")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("liked", true);

	if (!petitionsError && typeof petitionsCount === "number") {
		totalLikes += petitionsCount;
	}

	// Count liked reviews
	const { count: reviewsCount, error: reviewsError } = await supabase
		.from("User_Review")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("liked", true);

	if (!reviewsError && typeof reviewsCount === "number") {
		totalLikes += reviewsCount;
	}

	return totalLikes;
}

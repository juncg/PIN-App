import { DEFAULT_LOCALE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IUser } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { getTranslations } from "next-intl/server";

export async function ProfileServices(uuid: number, searchParams: Promise<ISearchParams>) {
	const currentUserUuid = await getUserUuid();
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "profile" });
	var followedByUser = false;

	const user = uuid
		? await GetFromDatabase<IUser>({
				tableName: "User",
				select: "*",
				filters: [{ method: "eq", column: "id", value: uuid }],
		  })
		: null;

	const userData = user?.data?.[0];

	const { data: employeeData } = await GetFromDatabase<any>({
		tableName: "Business_Employee",
		select: "business_id",
		filters: [{ method: "eq", column: "user_id", value: userData?.id }],
	});

	const { data: businessCreatorData } = await GetFromDatabase<any>({
		tableName: "Business",
		select: "id",
		filters: [{ method: "eq", column: "owner_id", value: userData?.id }],
	});

	const isBusinessUser = !!(employeeData?.length || businessCreatorData?.length);

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
		const { data: countData } = await GetFromDatabase<any>({
			tableName: "User_Forum",
			select: "*",
			filters: [{ method: "eq", column: "user_id", value: uuid }],
		});
		followingForumsCount = countData?.length || 0;
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
		const { data: countData } = await GetFromDatabase<any>({
			tableName: "User_Business",
			select: "*",
			filters: [{ method: "eq", column: "user_id", value: uuid }],
		});
		followingBusinessesCount = countData?.length || 0;
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
		const { data: countData } = await GetFromDatabase<any>({
			tableName: "User_User",
			select: "*",
			filters: [{ method: "eq", column: "user_id", value: uuid }],
		});
		followingUsersCount = countData?.length || 0;
	}

	const { data: subscribedOffersRaw } = await GetFromDatabase<any>({
		tableName: "User_Offer",
		select: "Offer(*, User!Offer_creator_id_fkey(*))",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "offer_id", ascending: false },
			{ method: "range", from: 0, to: 2 },
		],
		skipRLS: true,
	});

	const subscribedOffers =
		subscribedOffersRaw?.map((item) => {
			const offer = item.Offer;
			offer.type = "Offer";
			return offer;
		}) || [];

	// Total subscribed offers count
	let subscribedOffersCount = 0;
	if (uuid) {
		const { data: countData } = await GetFromDatabase<any>({
			tableName: "User_Offer",
			select: "*",
			filters: [{ method: "eq", column: "user_id", value: uuid }],
			skipRLS: true,
		});
		subscribedOffersCount = countData?.length || 0;
	}

	const { data: subscribedPetitionsRaw } = await GetFromDatabase<any>({
		tableName: "User_Petition",
		select: "Petition(*, User!Petition_creator_id_fkey(*))",
		filters: [
			{ method: "eq", column: "user_id", value: uuid },
			{ method: "order", column: "petition_id", ascending: false },
			{ method: "range", from: 0, to: 5 },
		],
		skipRLS: true,
	});

	const subscribedPetitions =
		subscribedPetitionsRaw?.map((item) => {
			const petition = item.Petition;
			petition.type = "Petition";
			return petition;
		}) || [];

	// Total subscribed petitions count
	let subscribedPetitionsCount = 0;
	if (uuid) {
		const { data: countData } = await GetFromDatabase<any>({
			tableName: "User_Petition",
			select: "*",
			filters: [{ method: "eq", column: "user_id", value: uuid }],
			skipRLS: true,
		});
		subscribedPetitionsCount = countData?.length || 0;
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

	const clientTranslations = {
		followed: translator("followed"),
		follow: translator("follow"),
	};

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
		clientTranslations,
		isBusinessUser,
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

	let totalLikes = 0;

	// Count liked offers
	const { data: offersData } = await GetFromDatabase<any>({
		tableName: "User_Offer",
		select: "*",
		filters: [
			{ method: "eq", column: "user_id", value: userId },
			{ method: "eq", column: "liked", value: true },
		],
		skipRLS: true,
	});
	totalLikes += offersData?.length || 0;

	// Count liked petitions
	const { data: petitionsData } = await GetFromDatabase<any>({
		tableName: "User_Petition",
		select: "*",
		filters: [
			{ method: "eq", column: "user_id", value: userId },
			{ method: "eq", column: "liked", value: true },
		],
		skipRLS: true,
	});
	totalLikes += petitionsData?.length || 0;

	// Count liked reviews
	const { data: reviewsData } = await GetFromDatabase<any>({
		tableName: "User_Review",
		select: "*",
		filters: [
			{ method: "eq", column: "user_id", value: userId },
			{ method: "eq", column: "liked", value: true },
		],
		skipRLS: true,
	});
	totalLikes += reviewsData?.length || 0;

	return totalLikes;
}

import { GetFromDatabase, GetServiceClient } from "@/lib/services/general";
import { IUser } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function ProfileServices() {
	const uuid = await getUserUuid();
	const user = uuid
		? await GetFromDatabase<IUser>({
				tableName: "User",
				select: "*",
				filters: [{ method: "eq", column: "id", value: uuid }],
		  })
		: null;

	const userData = user?.data?.[0];

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

	return {
		userData,
		followingForums,
		followingForumsCount,
		followingBusinesses,
		followingBusinessesCount,
		followingUsers,
		followingUsersCount,
	};
}

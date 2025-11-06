import { GetFromDatabase } from "@/lib/services/general";
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

	const { data: userBusinesses } = await GetFromDatabase<any>({
		tableName: "User_Business",
		select: "Business(*)",
		filters: [{ method: "eq", column: "user_id", value: uuid }],
	});

	const companies = userBusinesses?.map((ub) => ub.Business) ?? [];

	return { userData, companies };
}

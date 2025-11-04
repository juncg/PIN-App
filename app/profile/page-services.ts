import { GetFromDatabase } from "@/lib/services/general";
import { IUser } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function ProfileServices() {
	const uuid = await getUserUuid();

	const { data: user } = await GetFromDatabase<IUser>({
		tableName: "User",
		select: "*",
		filters: [{ method: "eq", column: "id", value: uuid }],
	});

	return { user };
}

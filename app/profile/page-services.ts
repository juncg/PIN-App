import { GetFromDatabase } from "@/lib/services/general";
import { IUser } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

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

	return { userData };
}

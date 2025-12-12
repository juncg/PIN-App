import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness, IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function CreateOfferServices() {
	const currentUserId = await getUserUuid();

	const forums = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*",
	});

	const tags = await GetFromDatabase<{ id: number; name: string }>({
		tableName: "Tag",
		select: "*",
	});

	const { data: ownedBusinesses } = await GetFromDatabase<IBusiness>({
		tableName: "Business",
		select: "*",
		filters: [{ method: "eq", column: "owner_id", value: currentUserId }],
	});

	const { data: employeeRelations } = await GetFromDatabase<{
		Business: IBusiness;
	}>({
		tableName: "Business_Employee",
		select: "Business(*)",
		filters: [{ method: "eq", column: "user_id", value: currentUserId }],
	});

	const employeeBusinesses = employeeRelations?.map((rel) => rel.Business) || [];
	const allBusinesses = [...(ownedBusinesses || []), ...employeeBusinesses];

	const businesses = allBusinesses.filter(
		(business, index, self) => index === self.findIndex((b) => b.id === business.id)
	);

	return { forums, tags, businesses };
}


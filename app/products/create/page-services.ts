import { GetFromDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";

export async function CreateProductServices() {
	const uuid = await getUserUuid();

	const userBusinesses = await GetFromDatabase<{ business_id: number; name: string | null }>({
		tableName: "User_Business",
		select: "business_id, Business(name)",
		filters: [{ method: "eq", column: "user_id", value: uuid }],
	});

	const businesses = userBusinesses.data?.map((ub) => ({
		id: ub.business_id,
		name: (ub as any).Business?.name,
	})) || [];

	const categories = await GetFromDatabase<{ id: number; name: string | null }>({
		tableName: "Category",
		select: "id, name",
		filters: [{ method: "order", column: "name", ascending: true }],
	});

	return { businesses, categories: categories.data || [] };
}
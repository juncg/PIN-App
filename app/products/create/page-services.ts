"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function CreateProductServices() {
	const userUuid = await getUserUuid();

	if (!userUuid) {
		return { businesses: [], categories: [], error: "Usuario no autenticado" };
	}

	const { data: ownedBusinesses, error: ownedError } = await GetFromDatabase<IBusiness>({
		tableName: "Business",
		select: "*",
		filters: [{ method: "eq", column: "owner_id", value: userUuid }],
	});

	const { data: employeeRelations, error: employeeError } = await GetFromDatabase<{
		Business: IBusiness;
	}>({
		tableName: "Business_Employee",
		select: "Business(*)",
		filters: [{ method: "eq", column: "user_id", value: userUuid }],
	});

	if (ownedError && employeeError) {
		return {
			businesses: [],
			categories: [],
			error: ownedError?.message || employeeError?.message || "Error al obtener negocios",
		};
	}

	const employeeBusinesses = employeeRelations?.map((rel) => rel.Business) || [];
	const allBusinesses = [...(ownedBusinesses || []), ...employeeBusinesses];

	const uniqueBusinesses = allBusinesses.filter(
		(business, index, self) => index === self.findIndex((b) => b.id === business.id)
	);

	const { data: categoriesData } = await GetFromDatabase<{ id: number; name: string | null }>({
		tableName: "Category",
		select: "id, name",
		filters: [{ method: "order", column: "name", ascending: true }],
	});

	return { businesses: uniqueBusinesses, categories: categoriesData || [] };
}


"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";

export async function CreateForumServices() {
	const userUuid = await getUserUuid();

	if (!userUuid) {
		return { businesses: [], error: "Usuario no autenticado" };
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
			error: ownedError?.message || employeeError?.message || "Error al obtener negocios",
		};
	}

	const employeeBusinesses = employeeRelations?.map((rel) => rel.Business) || [];
	const allBusinesses = [...(ownedBusinesses || []), ...employeeBusinesses];

	const uniqueBusinesses = allBusinesses.filter(
		(business, index, self) => index === self.findIndex((b) => b.id === business.id)
	);

	return { businesses: uniqueBusinesses, error: null };
}

import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness } from "@/lib/services/types";

export async function BusinessesServices() {
	const businesses = await GetFromDatabase<IBusiness>({ tableName: "Business", select: "*" });

	return { businesses };
}

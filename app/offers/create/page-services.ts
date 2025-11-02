import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";

export async function CreateOfferServices() {
	const forums = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*",
	});

	const tags = await GetFromDatabase<{ id: number; name: string }>({
		tableName: "Tag",
		select: "*",
	});

	return { forums, tags };
}

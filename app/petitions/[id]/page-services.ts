import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";

export async function PetitionDetailsService(id: number) {
	const { data: petition } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User!Petition_creator_id_fkey(*), User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name))`,
		filters: [{ method: "eq", column: "id", value: id }],
	});

	return { petition };
}

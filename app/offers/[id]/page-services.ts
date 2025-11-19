import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";

export async function OfferDetailsService(id: number) {
	const { data: offer } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User!Offer_creator_id_fkey(*), User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
		filters: [{ method: "eq", column: "id", value: id }],
	});

	return { offer };
}

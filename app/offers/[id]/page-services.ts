import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IUser } from "@/lib/services/types";
import { fetchTopLevelComments } from "../../shared-services/post-shared-services";

export async function OfferDetailsService(id: number, userUuid: string) {
    const { data: offer } = await GetFromDatabase<IOffer>({
        tableName: "Offer",
        select: `*, User!Offer_creator_id_fkey(*), User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
        filters: [{ method: "eq", column: "id", value: id }],
    });

    const { comments } = await fetchTopLevelComments(id, "offer");

    const currentUser =
        userUuid && userUuid.trim() !== ""
            ? await GetFromDatabase<IUser>({
                    tableName: "User",
                    select: "*",
                    filters: [{ method: "eq", column: "id", value: userUuid }],
              })
            : null;

	// Obtener ofertas de la misma empresa
	const businessId = offer?.[0]?.User?.id;
	let businessOffers: IOffer[] = [];
	
	if (businessId) {
		const { data } = await GetFromDatabase<IOffer>({
			tableName: "Offer",
			select: `*, User!Offer_creator_id_fkey(*), User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
			filters: [
				{ method: "eq", column: "creator_id", value: businessId },
				{ method: "limit", to: 4 }
			],
		});
		businessOffers = data || [];
	}

	return { offer, comments, currentUser: currentUser?.data?.[0] || null, businessOffers };
}

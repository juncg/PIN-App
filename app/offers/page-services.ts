import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function OfferServices() {
	const currentUserId = await getUserUuid();

	const offersWithRelations = await GetFromDatabase<IOffer & { User_Offer: [{ liked: boolean }] | [] }>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked)`,
		filters: [{ method: "eq", column: "User_Offer.user_id", value: currentUserId }],
	});

	const offers: (IOffer & { liked: boolean })[] = offersWithRelations.map((offer) => {
		const isLiked = offer.User_Offer.length > 0 ? offer.User_Offer[0]?.liked : false;

		const { ...restOfOffer } = offer;

		return {
			...restOfOffer,
			liked: isLiked,
		} as IOffer & { liked: boolean };
	});

	console.log("Offers with liked status:", offers);

	return { offers };
}

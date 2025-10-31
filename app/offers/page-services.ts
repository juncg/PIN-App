import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function OfferServices() {
	const currentUserId = await getUserUuid();

	const { data: offersWithRelations, error: offersError } = await GetFromDatabase<
		IOffer & {
			User_Offer: { liked: boolean; subscribed: boolean; user_id: string }[];
			tags: { Tag: { name: string | null } }[];
		}
	>({ tableName: "Offer", select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))` });

	if (offersError) {
		console.error("Error fetching offers:", offersError);
		return { offers: [] };
	}

	const offers: (IOffer & {
		liked: boolean;
		subscribed: boolean;
		tags: string[];
	})[] = (offersWithRelations ?? []).map((offer) => {
		const userOffer = offer.User_Offer?.find((uo) => uo.user_id === currentUserId);
		const isLiked = userOffer?.liked || false;
		const isSubscribed = userOffer?.subscribed || false;

		const tagNames =
			offer.tags
				?.map((tagRel) => tagRel.Tag.name)
				.filter((name): name is string => typeof name === "string" && name.trim() !== "") || [];

		return {
			...offer,
			liked: isLiked,
			subscribed: isSubscribed,
			tags: tagNames,
		};
	});

	console.log("Offers with liked status:", offers);

	return { offers };
}

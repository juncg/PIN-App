import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function OfferServices() {
	const currentUserId = await getUserUuid();

	const offersWithRelations = await GetFromDatabase<
		IOffer & {
			User_Offer: [{ liked: boolean }] | [];
			tags: { Tag: { name: string | null } }[];
		}
	>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked, user_id), tags:Offer_Tag(Tag(name))`,
	});

	const offers: (IOffer & { liked: boolean; tags: string[] })[] = (offersWithRelations.data ?? []).map((offer) => {
		const userOffer = offer.User_Offer?.find((up) => up.user_id === currentUserId);

		const isLiked = userOffer?.liked || false;

		const tagNames = offer.tags
			? offer.tags
					.map((tagRel) => tagRel.Tag.name)
					.filter((name): name is string => typeof name === "string" && name.trim() !== "")
			: [];

		return {
			...offer,
			liked: isLiked,
			tags: tagNames,
		} as IOffer & { liked: boolean; tags: string[] };
	});

	console.log("Offers with liked status:", offers);

	return { offers };
}

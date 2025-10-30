import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function HomeServices() {
	const currentUserId = await getUserUuid();
	const productSelect = "*, businesses:Product_Business!inner(business:Business(*))";

	const { data: products, error: productsError } = await GetFromDatabase<IProduct>({ tableName: "Product", select: productSelect });
	if (productsError) {
		console.error("Error fetching products:", productsError);
		return { products: [], offers: [], petitions: [] };
	}

	const { data: offersWithRelations, error: offersError } = await GetFromDatabase<
		IOffer & {
			User_Offer: { liked: boolean; user_id: string }[];
			tags: { Tag: { name: string | null } }[];
		}
	>({ tableName: "Offer", select: `*, User_Offer!left(liked, user_id), tags:Offer_Tag(Tag(name))` });
	if (offersError) {
		console.error("Error fetching offers:", offersError);
		return { products, offers: [], petitions: [] };
	}

	const offers: (IOffer & { liked: boolean; tags: string[] })[] = (offersWithRelations ?? []).map((offer) => {
		const userOffer = offer.User_Offer?.find((uo) => uo.user_id === currentUserId);
		const isLiked = userOffer?.liked || false;

		const tagNames =
			offer.tags
				?.map((tagRel) => tagRel.Tag.name)
				.filter((name): name is string => typeof name === "string" && name.trim() !== "") || [];

		return {
			...offer,
			liked: isLiked,
			tags: tagNames,
		};
	});

	const { data: petitionsWithRelations, error: petitionsError } = await GetFromDatabase<
		IPetition & {
			User_Petition: { liked: boolean; user_id: string }[];
			tags: { Tag: { name: string | null } }[];
		}
	>({ tableName: "Petition", select: `*, User_Petition!left(liked, user_id), tags:Petition_Tag(Tag(name))` });
	if (petitionsError) {
		console.error("Error fetching petitions:", petitionsError);
		return { products, offers, petitions: [] };
	}

	const petitions: (IPetition & { liked: boolean; tags: string[] })[] = (petitionsWithRelations ?? []).map(
		(petition) => {
			const userPetition = petition.User_Petition?.find((up) => up.user_id === currentUserId);
			const isLiked = userPetition?.liked || false;

			const tagNames =
				petition.tags
					?.map((tagRel) => tagRel.Tag.name)
					.filter((name): name is string => typeof name === "string" && name.trim() !== "") || [];

			return {
				...petition,
				liked: isLiked,
				tags: tagNames,
			};
		}
	);

	return { offers, petitions, products };
}

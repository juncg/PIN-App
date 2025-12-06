"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness, IForum, IOffer, IPetition, IProduct, IUser } from "@/lib/services/types";

export async function SearchGeneralServices(searchQuery: string) {
	const limit = 3;

	const [offersResult, petitionsResult, forumsResult, businessesResult, productsResult, usersResult] =
		await Promise.all([
			GetFromDatabase<IOffer>({
				tableName: "Offer",
				select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
				filters: [
					{ method: "range", from: 0, to: limit - 1 },
					{ method: "ilike", column: "title", value: `%${searchQuery}%` },
				],
			}),
			GetFromDatabase<IPetition>({
				tableName: "Petition",
				select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User(name, surnames)`,
				filters: [
					{ method: "range", from: 0, to: limit - 1 },
					{ method: "ilike", column: "title", value: `%${searchQuery}%` },
				],
			}),
			GetFromDatabase<IForum>({
				tableName: "Forum",
				select: `*, Business(name), Forum_Tag(Tag(name))`,
				filters: [
					{ method: "range", from: 0, to: limit - 1 },
					{ method: "ilike", column: "name", value: `%${searchQuery}%` },
				],
			}),
			GetFromDatabase<IBusiness>({
				tableName: "Business",
				select: `*`,
				filters: [
					{ method: "range", from: 0, to: limit - 1 },
					{ method: "ilike", column: "name", value: `%${searchQuery}%` },
				],
			}),
			GetFromDatabase<IProduct>({
				tableName: "Product",
				select: `*`,
				filters: [
					{ method: "range", from: 0, to: limit - 1 },
					{ method: "ilike", column: "name", value: `%${searchQuery}%` },
				],
			}),
			GetFromDatabase<IUser>({
				tableName: "User",
				select: `*`,
				filters: [
					{ method: "range", from: 0, to: limit - 1 },
					{ method: "or", value: `name.ilike.%${searchQuery}%,surnames.ilike.%${searchQuery}%` },
				],
			}),
		]);

	const offers = offersResult.data || [];
	const petitions = petitionsResult.data || [];
	const forums = forumsResult.data || [];
	const businesses = businessesResult.data || [];
	const products = productsResult.data || [];
	const users = usersResult.data || [];

	offers.forEach((offer) => {
		offer.type = "Offer";
	});

	petitions.forEach((petition) => {
		petition.type = "Petition";
	});

	return {
		offers,
		petitions,
		forums,
		businesses,
		products,
		users,
	};
}

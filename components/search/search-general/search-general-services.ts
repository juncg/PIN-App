"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness, IForum, IOffer, IPetition, IProduct, IUser } from "@/lib/services/types";

export async function SearchGeneralServices(searchQuery: string) {
	const limit = 3;

	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
		filters: [
			{ method: "range", from: 0, to: limit - 1 },
			{ method: "ilike", column: "title", value: `%${searchQuery}%` },
		],
	});

	offers?.forEach((offer) => {
		offer.type = "Offer";
	});

	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User(name, surnames)`,
		filters: [
			{ method: "range", from: 0, to: limit - 1 },
			{ method: "ilike", column: "title", value: `%${searchQuery}%` },
		],
	});

	petitions?.forEach((petition) => {
		petition.type = "Petition";
	});

	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `*, Business(name), Forum_Tag(Tag(name))`,
		filters: [
			{ method: "range", from: 0, to: limit - 1 },
			{ method: "ilike", column: "name", value: `%${searchQuery}%` },
		],
	});

	const { data: businesses } = await GetFromDatabase<IBusiness>({
		tableName: "Business",
		select: `*`,
		filters: [
			{ method: "range", from: 0, to: limit - 1 },
			{ method: "ilike", column: "name", value: `%${searchQuery}%` },
		],
	});

	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: `*`,
		filters: [
			{ method: "range", from: 0, to: limit - 1 },
			{ method: "ilike", column: "name", value: `%${searchQuery}%` },
		],
	});

	const { data: users } = await GetFromDatabase<IUser>({
		tableName: "User",
		select: `*`,
		filters: [
			{ method: "range", from: 0, to: limit - 1 },
			{ method: "or", value: `name.ilike.%${searchQuery}%,surnames.ilike.%${searchQuery}%` },
		],
	});

	return {
		offers: offers || [],
		petitions: petitions || [],
		forums: forums || [],
		businesses: businesses || [],
		products: products || [],
		users: users || [],
	};
}

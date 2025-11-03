import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";

export async function HomeServices() {
	const { data: products } = await GetFromDatabase<IProduct>({
		tableName: "Product",
		select: "*, businesses:Product_Business!inner(business:Business(*))",
	});

	const { data: offers } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
	});

	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name))`,
	});

	return { offers, petitions, products };
}

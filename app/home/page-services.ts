import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";

export async function HomeServices() {
	const productSelect = "*, businesses:Product_Business!inner(business:Business(*))";
	const offerSelect = "*, businesses:Business!inner(business:Business(*))";
	const petitionSelect = "*, businesses:Petition_Business!inner(business:Business(*))";

	const products = await GetFromDatabase<IProduct>({ tableName: "Product", select: productSelect });
	const offers = await GetFromDatabase<IOffer>({ tableName: "Offer", select: offerSelect });
	const petitions = await GetFromDatabase<IPetition>({ tableName: "Petition", select: petitionSelect });

	return { offers, petitions, products };
}

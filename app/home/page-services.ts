import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";

export async function HomeServices() {
    const offers = await GetFromDatabase<IOffer>({ tableName: "Offer", select: "*" });
	const petitions = await GetFromDatabase<IPetition>({ tableName: "Petition", select: "*" });

    const productSelect: string = `
        id,
        name,
        description,
        business:Product_Business!inner(
            Business(id, name)
        )`;
	const products = await GetFromDatabase<IProduct>({ tableName: "Product", select: productSelect });

    console.log(products)
    
    return { offers, petitions, products };
}
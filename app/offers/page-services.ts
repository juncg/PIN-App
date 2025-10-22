import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";


export async function OfferServices() {
    const offers = await GetFromDatabase<IOffer>({ tableName: "Offer", select: "*" });

    return { offers };
}
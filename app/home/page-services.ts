import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function HomeServices() {
    const currentUserId = await getUserUuid();
    const productSelect = "*, businesses:Product_Business!inner(business:Business(*))";
    const offerSelect = "*, User_Offer!left(*)";
    const petitionSelect = "*, User_Petition!left(*)";

    const products = await GetFromDatabase<IProduct>({ tableName: "Product", select: productSelect });
    
    const offersWithRelations = await GetFromDatabase<IOffer>({ 
        tableName: "Offer", 
        select: offerSelect,
        eq: ["User_Offer.user_id", currentUserId || ""]
    });

    const offers: (IOffer & { liked: boolean })[] = offersWithRelations.map(offer => {
        const isLiked = offer.User_Offer && offer.User_Offer.length > 0 ? offer.User_Offer[0]?.liked : false;
        return {
            ...offer,
            liked: isLiked || false
        };
    });

    const petitionsWithRelations = await GetFromDatabase<IPetition>({ 
        tableName: "Petition", 
        select: petitionSelect,
        eq: ["User_Petition.user_id", currentUserId || ""]
    });

    const petitions: (IPetition & { liked: boolean })[] = petitionsWithRelations.map(petition => {
        const isLiked = petition.User_Petition && petition.User_Petition.length > 0 ? petition.User_Petition[0]?.liked : false;
        return {
            ...petition,
            liked: isLiked || false
        };
    });

    return { offers, petitions, products };
}

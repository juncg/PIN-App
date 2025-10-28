import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";


export async function OfferServices() {
    const currentUserId = await getUserUuid();

    const offersWithRelations = await GetFromDatabase<IOffer & { User_Offer: [{ liked: boolean, subscribed: boolean }] | [] }>({
        tableName: 'Offer',
        select: `*, User_Offer!left(liked, subscribed)`,
        eq: ['User_Offer.user_id', currentUserId]
    });

    const offers: (IOffer & { liked: boolean, subscribed: boolean })[] = offersWithRelations.map(offer => {
        const isLiked = offer.User_Offer.length > 0 ? offer.User_Offer[0]?.liked : false;
        const isSubscribed = offer.User_Offer.length > 0 ? offer.User_Offer[0]?.subscribed : false;

        const { User_Offer, ...restOfOffer } = offer;

        return {
            ...restOfOffer,
            liked: isLiked,
            subscribed: isSubscribed
        } as IOffer & { liked: boolean, subscribed: boolean };
    });

    console.log('Offers with liked status:', offers);

    return { offers };
}
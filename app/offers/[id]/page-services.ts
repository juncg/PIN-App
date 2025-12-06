import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IUser } from "@/lib/services/types";
import { fetchTopLevelComments } from "../../shared-services/post-shared-services";

export async function OfferDetailsService(id: number, userUuid: string) {
    const { data: offer } = await GetFromDatabase<IOffer>({
        tableName: "Offer",
        select: `*, User!Offer_creator_id_fkey(*), User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name))`,
        filters: [{ method: "eq", column: "id", value: id }],
    });

    // Fetch top-level comments with reply counts
    const { comments } = await fetchTopLevelComments(id, "offer");

    const currentUser =
        userUuid && userUuid.trim() !== ""
            ? await GetFromDatabase<IUser>({
                    tableName: "User",
                    select: "*",
                    filters: [{ method: "eq", column: "id", value: userUuid }],
              })
            : null;

    const businessOffers = []; // Add your business logic if needed

    return { 
        offer: offer?.[0] || null, 
        comments, 
        currentUser: currentUser?.data?.[0] || null, 
        businessOffers 
    };
}

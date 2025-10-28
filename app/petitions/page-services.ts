import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function PetitionServices() {
    const currentUserId = await getUserUuid();

    const petitionsWithRelations = await GetFromDatabase<IPetition & { User_Petition: [{ liked: boolean, subscribed: boolean }] | [] }>({
        tableName: 'Petition',
        select: `*, User_Petition!left(liked, subscribed)`,
        eq: ['User_Petition.user_id', currentUserId]
    });

    const petitions: (IPetition & { liked: boolean, subscribed: boolean })[] = petitionsWithRelations.map(petition => {
        const isLiked = petition.User_Petition.length > 0 ? petition.User_Petition[0]?.liked : false;
        const isSubscribed = petition.User_Petition.length > 0 ? petition.User_Petition[0]?.subscribed : false;

        const { User_Petition, ...restOfPetition } = petition;

        return {
            ...restOfPetition,
            liked: isLiked,
            subscribed: isSubscribed
        } as IPetition & { liked: boolean, subscribed: boolean };
    });

    console.log('Petitions with liked status:', petitions);

    return { petitions };
}
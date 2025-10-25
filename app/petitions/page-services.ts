import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function PetitionServices() {
    const currentUserId = await getUserUuid();

    const petitionsWithRelations = await GetFromDatabase<IPetition & { User_Petition: [{ liked: boolean }] | [] }>({
        tableName: 'Petition',
        select: `*, User_Petition!left(liked)`,
        eq: ['User_Petition.user_id', currentUserId] 
    });

    const petitions: (IPetition & { liked: boolean })[] = petitionsWithRelations.map(petition => {
        const isLiked = petition.User_Petition.length > 0 ? petition.User_Petition[0]?.liked : false;

        const { User_Petition, ...restOfPetition } = petition;

        return {
            ...restOfPetition,
            liked: isLiked
        } as IPetition & { liked: boolean };
    });

    console.log('Petitions with liked status:', petitions);

    return { petitions };
}
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function PetitionServices() {
    const currentUserId = await getUserUuid();

    const petitionsWithRelations = await GetFromDatabase<IPetition & { User_Petition: { liked: boolean; user_id: string }[] }>({
        tableName: "Petition",
        select: `*, User_Petition!left(liked, user_id)`,
    });

    console.log("Fetched petitions with relations:", petitionsWithRelations);

    const petitions: (IPetition & { liked: boolean })[] = petitionsWithRelations.map((petition) => {
        const userPetition = petition.User_Petition?.find(up => up.user_id === currentUserId);
        const isLiked = userPetition?.liked || false;

        return {
            ...petition,
            liked: isLiked,
        } as IPetition & { liked: boolean };
    });

    console.log("Petitions with liked status:", petitions);

    return { petitions };
}

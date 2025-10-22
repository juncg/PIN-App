import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";


export async function PetitionServices() {
    const petitions = await GetFromDatabase<IPetition>({ tableName: "Petition", select: "*" });

    return { petitions };
}


import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function PetitionServices() {
  const currentUserId = await getUserUuid();

  const { data: petitionsWithRelations, error: petitionsError } = await GetFromDatabase<
    IPetition & {
      User_Petition: { liked: boolean; subscribed: boolean; user_id: string }[];
      tags: { Tag: { name: string | null } }[];
    }
  >({ tableName: "Petition", select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name))` });

  if (petitionsError) {
    console.error("Error fetching petitions:", petitionsError);
    return { petitions: [] };
  }

  const petitions: (IPetition & { liked: boolean; subscribed: boolean; tags: string[] })[] = (petitionsWithRelations ?? []).map((petition) => {
    const userPetition = petition.User_Petition?.find((up) => up.user_id === currentUserId);
    const isLiked = userPetition?.liked || false;
    const isSubscribed = userPetition?.subscribed || false;

    const tagNames = petition.tags?.map((tagRel) => tagRel.Tag.name).filter((name): name is string => typeof name === "string" && name.trim() !== "") || [];

    return {
      ...petition,
      liked: isLiked,
      subscribed: isSubscribed,
      tags: tagNames,
    };
  });

  console.log("Petitions with liked status:", petitions);

  return { petitions };
}

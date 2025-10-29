import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export async function PetitionServices() {
  const currentUserId = await getUserUuid();

  const petitionsWithRelations = await GetFromDatabase<
    IPetition & {
      User_Petition: { liked: boolean; user_id: string }[];
      tags: { Tag: { name: string | null } }[];
    }
  >({
    tableName: "Petition",
    select: `*, User_Petition!left(liked, user_id), tags:Petition_Tag(Tag(name))`,
  });

  const petitions: (IPetition & { liked: boolean, tags: string[] })[] =
    petitionsWithRelations.map((petition) => {
      const userPetition = petition.User_Petition?.find(
        (up) => up.user_id === currentUserId
      );
      const isLiked = userPetition?.liked || false;

      const tagNames = petition.tags
        ? petition.tags.map((tagRel) => tagRel.Tag.name).filter((name): name is string => typeof name === "string" && name.trim() !== "")
        : [];

      return {
        ...petition,
        liked: isLiked,
        tags: tagNames,
      } as IPetition & { liked: boolean, tags: string[] };
    });

  console.log("Petitions with liked status:", petitions);

  return { petitions };
}

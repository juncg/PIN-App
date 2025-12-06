import { Tables } from "@/database.types";
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition, IComment, IUser } from "@/lib/services/types";
import { fetchTopLevelComments } from "../../shared-services/post-shared-services";

export async function PetitionDetailsService(id: number, userUuid: string) {
	const { data: petition } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User!Petition_creator_id_fkey(*), User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name))`,
		filters: [{ method: "eq", column: "id", value: id }],
	});

	const { comments, error } = await fetchTopLevelComments(id, "Petition");

	const currentUser =
		userUuid && userUuid.trim() !== ""
			? await GetFromDatabase<IUser>({
					tableName: "User",
					select: "*",
					filters: [{ method: "eq", column: "id", value: userUuid }],
			  })
			: null;

	return { petition, comments, currentUser: currentUser?.data?.[0] || null };
}

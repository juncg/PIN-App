import { Tables } from "@/database.types";
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition, IComment, IUser } from "@/lib/services/types";

export async function PetitionDetailsService(id: number, userUuid: string) {
	const { data: petition } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User!Petition_creator_id_fkey(*), User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name))`,
		filters: [{ method: "eq", column: "id", value: id }],
	});

	const { data: commentPosts, error } = await GetFromDatabase<{
		comment_id: number;
		petition_id: number;
		referenced_comment_id: number | null;
		Comment: Tables<"Comment"> & {
			User: Tables<"User">;
		};
	}>({
		tableName: "Comment_Post",
		select: `
            comment_id,
            petition_id,
            referenced_comment_id,
            Comment!Comment_Post_comment_id_fkey(
                id,
                text,
                likes,
                superlikes,
                created_at,
                state,
                comment_locked_state,
                creator_id,
                forum_id,
                User!Comment_creator_id_fkey(
                    id,
                    username,
                    name,
                    surnames,
                    profile_picture
                )
            )
        `,
		filters: [
			{ method: "eq", column: "petition_id", value: id },
			{ method: "is", column: "referenced_comment_id", value: null },
			{ method: "order", column: "Comment(created_at)", ascending: false },
		],
	});

	if (error || !commentPosts) {
		return { comments: [], error };
	}

	const comments: IComment[] = commentPosts.map((item) => ({
		...item.Comment,
		user: item.Comment.User,
		replies: [],
	}));

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

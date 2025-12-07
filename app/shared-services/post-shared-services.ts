"use server";

import { GetFromDatabase } from "@/lib/services/general";
import { IComment, IUser } from "@/lib/services/types";

type PostType = "offer" | "petition";

// fetch top-level comments with reply counts
export async function fetchTopLevelComments(
    postId: number,
    postType: PostType
): Promise<{ comments: IComment[]; error: any }> {
    const columnName = postType === "offer" ? "offer_id" : "petition_id";

    const { data: comments, error } = await GetFromDatabase<IComment>({
        tableName: "Comment",
        select: `
            *,
            user:User!Comment_creator_id_fkey(*),
            Comment_Post!inner(
                ${columnName},
                referenced_comment_id
            )
        `,
        filters: [
            { method: "eq", column: `Comment_Post.${columnName}`, value: postId },
            { method: "is", column: "Comment_Post.referenced_comment_id", value: null },
            { method: "order", column: "created_at", ascending: false },
        ],
    });

    if (error || !comments) {
        return { comments: [], error };
    }

    // get reply counts for each top-level comment
    const commentsWithCounts = await Promise.all(
        comments.map(async (comment) => {
            const { data: replyCount } = await GetFromDatabase({
                tableName: "Comment_Post",
                select: "comment_id",
                filters: [
                    { method: "eq", column: "referenced_comment_id", value: comment.id },
                ],
            });

            return {
                ...comment,
                replyCount: replyCount?.length || 0,
                replies: [],
            };
        })
    );

    return { comments: commentsWithCounts, error: null };
}

// fetch flat replies for a parent comment (YouTube style)
export async function fetchCommentReplies(
    commentId: number
): Promise<{ replies: IComment[]; error: any }> {
    // first, get Comment_Post records with referenced_user_id
    const { data: commentPosts, error: commentPostError } = await GetFromDatabase({
        tableName: "Comment_Post",
        select: "comment_id, referenced_comment_id, referenced_user_id",
        filters: [
            { method: "eq", column: "referenced_comment_id", value: commentId },
        ],
    });

    if (commentPostError || !commentPosts || commentPosts.length === 0) {
        console.error("Error fetching Comment_Post:", commentPostError);
        return { replies: [], error: commentPostError };
    }

    // get all comment IDs
    const commentIds = commentPosts.map((cp: any) => cp.comment_id);

    // fetch the actual comments
    const { data: replies, error } = await GetFromDatabase<IComment>({
        tableName: "Comment",
        select: `
            *,
            user:User!Comment_creator_id_fkey(*)
        `,
        filters: [
            { method: "in", column: "id", value: commentIds },
            { method: "order", column: "created_at", ascending: false },
        ],
    });

    if (error || !replies) {
        console.error("Error fetching replies:", error);
        return { replies: [], error };
    }

    // match replies with their referenced_user_id from Comment_Post
    const repliesWithReferencedUsers = await Promise.all(
        replies.map(async (reply) => {
            const commentPost = commentPosts.find((cp: any) => cp.comment_id === reply.id);
            const referencedUserId = commentPost?.referenced_user_id;
            
            console.log("Reply ID:", reply.id, "Referenced User ID:", referencedUserId);
            
            if (!referencedUserId) {
                return {
                    ...reply,
                    referencedUser: null,
                    replyCount: 0,
                    replies: [],
                };
            }

            // fetch the referenced user
            const { data: users, error: userError } = await GetFromDatabase<IUser>({
                tableName: "User",
                select: "*",
                filters: [{ method: "eq", column: "id", value: referencedUserId }],
            });

            if (userError) {
                console.error("Error fetching referenced user:", userError);
            }

            console.log("Fetched referenced user:", users?.[0]?.username);

            return {
                ...reply,
                referencedUser: users?.[0] || null,
                replyCount: 0,
                replies: [],
            };
        })
    );

    console.log("Replies with referenced users:", repliesWithReferencedUsers.map(r => ({
        id: r.id,
        referencedUser: r.referencedUser?.username
    })));

    return { replies: repliesWithReferencedUsers, error: null };
}
"use server";

import { Tables } from "@/database.types";
import { GetFromDatabase } from "@/lib/services/general";
import { IComment } from "@/lib/services/types";

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
            user:User(*),
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
                replies: [], // empty initially
            };
        })
    );

    return { comments: commentsWithCounts, error: null };
}

// fetch replies for a specific comment
export async function fetchCommentReplies(
    commentId: number
): Promise<{ replies: IComment[]; error: any }> {
    const { data: replies, error } = await GetFromDatabase<IComment>({
        tableName: "Comment",
        select: `
            *,
            user:User(*),
            Comment_Post!inner(referenced_comment_id)
        `,
        filters: [
            { method: "eq", column: "Comment_Post.referenced_comment_id", value: commentId },
            { method: "order", column: "created_at", ascending: false },
        ],
    });

    if (error || !replies) {
        return { replies: [], error };
    }

    // get reply counts for nested replies too
    const repliesWithCounts = await Promise.all(
        replies.map(async (reply) => {
            const { data: replyCount } = await GetFromDatabase({
                tableName: "Comment_Post",
                select: "comment_id",
                filters: [
                    { method: "eq", column: "referenced_comment_id", value: reply.id },
                ],
            });

            return {
                ...reply,
                replyCount: replyCount?.length || 0,
                replies: [],
            };
        })
    );

    return { replies: repliesWithCounts, error: null };
}
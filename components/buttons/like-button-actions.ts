"use server";

import { ExecuteRpcFunction } from "@/lib/services/general";
import { createNotification } from "@/lib/services/notifications";
import { getUserUuid } from "@/lib/services/user";

interface ToggleLikeResult {
	new_like_count: number;
	user_liked: boolean;
}

export async function handleLikeAction(
	post_id: number,
	currentlyLiked: boolean,
	typeOfPost?: "Offer" | "Petition" | "Review",
	postCreatorId?: string
) {
	try {
		const user_id = await getUserUuid();

		if (!user_id) {
			throw new Error("User not authenticated");
		}

		let tableName: string;

		switch (typeOfPost) {
			case "Petition":
				tableName = "Petition";
				break;
			case "Offer":
				tableName = "Offer";
				break;
			case "Review":
				tableName = "Review";
				break;
			default:
				throw new Error(`Invalid typeOfPost: ${typeOfPost}`);
		}

		const { data, error } = await ExecuteRpcFunction<ToggleLikeResult>({
			functionName: "toggle_like",
			params: {
				post_id,
				target_table: tableName,
				given_user_id: user_id,
			},
		});

		if (error) {
			throw new Error(error.message);
		}

		if (!data || !Array.isArray(data) || data.length === 0) {
			throw new Error("Didn't recieve server response");
		}

		const result = data[0];

		if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
			console.log("[DEBUG] Like Action Response:", {
				post_id,
				typeOfPost,
				likeCount: result.new_like_count,
				userLiked: result.user_liked,
			});
		}

		if (result.user_liked && !currentlyLiked) {
			try {
				if (postCreatorId) {
					if (postCreatorId !== user_id) {
						let notificationMessage: string;
						let linkTo: string;

						switch (typeOfPost) {
							case "Offer":
								notificationMessage = `le dió me gusta a tu oferta.`;
								linkTo = `/offers/${post_id}`;
								break;
							case "Petition":
								notificationMessage = `le dió me gusta a tu petición.`;
								linkTo = `/petitions/${post_id}`;
								break;
							case "Review":
								notificationMessage = `le dió me gusta a tu reseña.`;
								linkTo = `/reviews/${post_id}`;
								break;
						}

						await createNotification({
							recipientId: postCreatorId,
							type: "Like",
							message: notificationMessage,
							linkTo: linkTo,
							senderId: user_id,
						});

						if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
							console.log("[DEBUG] Notification created for like:", {
								recipient: postCreatorId,
								type: "Like",
								post_id,
							});
						}
					}
				}
			} catch (notificationError) {
				console.error("Error creating like notification:", notificationError);
			}
		}

		return {
			success: true,
			likeCount: result.new_like_count,
			userLiked: result.user_liked,
		};
	} catch (error) {
		console.error("Error toggling like:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

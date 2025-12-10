"use server";

import { ExecuteRpcFunction, GetFromDatabase } from "@/lib/services/general";
import { notifyPostCompletion } from "@/lib/services/notifications";
import { getUserUuid } from "@/lib/services/user";

interface ToggleSubscriptionResult {
	new_subscription_count: number;
	user_subscribed: boolean;
}

export async function handleSubscribeAction(post_id: number, typeOfPost: "Oferta" | "Petición") {
	try {
		const user_id = await getUserUuid();

		if (!user_id) {
			throw new Error("User not authenticated");
		}

		let tableName: string;

		switch (typeOfPost) {
			case "Petición":
				tableName = "Petition";
				break;
			case "Oferta":
				tableName = "Offer";
				break;
			default:
				throw new Error(`Invalid typeOfPost: ${typeOfPost}`);
		}

		const { data, error } = await ExecuteRpcFunction<ToggleSubscriptionResult>({
			functionName: "toggle_subscription",
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
			console.log("[DEBUG] Subscribe Action Response:", {
				post_id,
				typeOfPost,
				subscriptionCount: result.new_subscription_count,
				userSubscribed: result.user_subscribed,
			});
		}

		const { data: postData } = await GetFromDatabase<{
			title: string;
			current_progress: number;
			target_progress: number;
		}>({
			tableName,
			select: "title, current_progress, target_progress",
			filters: [{ method: "eq", column: "id", value: post_id }],
		});

		if (postData && postData.length > 0) {
			const post = postData[0];
			if (post.current_progress >= post.target_progress) {
				const postType = typeOfPost === "Oferta" ? "Offer" : "Petition";
				const link = `/${postType.toLowerCase()}s/${post_id}`;
				await notifyPostCompletion({
					postId: post_id,
					postTitle: post.title,
					type: postType,
					link: link,
				});
			}
		}

		return {
			success: true,
			subscriptionCount: result.new_subscription_count,
			userSubscribed: result.user_subscribed,
		};
	} catch (error) {
		console.error("Error toggling subscription:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

"use server";

import { ExecuteRpcFunction } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";

interface ToggleFollowResult {
	is_following: boolean;
	new_followers_count: number;
}

export async function handleFollowAction(entityId: number | string, entityType: "User" | "Business" | "Forum") {
	try {
		const user_id = await getUserUuid();

		if (!user_id) {
			throw new Error("User not authenticated");
		}

		const params: {
			target_type: string;
			follower_user_uuid: string;
			target_id_int?: number;
			target_id_uuid?: string;
		} = {
			target_type: entityType,
			follower_user_uuid: user_id,
		};

		if (entityType === "User") {
			params.target_id_uuid = entityId as string;
		} else {
			params.target_id_int = entityId as number;
		}

		const { data, error } = await ExecuteRpcFunction<ToggleFollowResult>({
			functionName: "toggle_follow",
			params,
		});

		if (error) {
			throw new Error(error.message);
		}

		if (!data) {
			throw new Error("Didn't receive server response");
		}

		const result = Array.isArray(data) ? data[0] : data;

		if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
			console.log("[DEBUG] Follow Action Response:", {
				entityId,
				entityType,
				isFollowing: result.is_following,
				followersCount: result.new_followers_count,
			});
		}

		return {
			success: true,
			isFollowing: result.is_following,
			followersCount: result.new_followers_count,
		};
	} catch (error) {
		console.error("Error toggling follow:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}

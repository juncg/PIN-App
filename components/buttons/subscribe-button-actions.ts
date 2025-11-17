"use server";

import { ExecuteRpcFunction } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";

interface ToggleSubscriptionResult {
    new_subscription_count: number;
    user_subscribed: boolean;
}

export async function handleSubscribeAction(
    post_id: number,
    typeOfPost: "Oferta" | "Petición"
) {
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

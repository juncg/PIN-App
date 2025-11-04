"use server";

import { ExecuteRpcFunction, GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";

export async function handleSubscribeAction(
	post_id: number,
	currentlySubscribed: boolean,
	typeOfPost?: "Oferta" | "Petición"
) {
	try {
		const user_id = await getUserUuid();

		if (!user_id) {
			throw new Error("Usuario no autenticado");
		}

		const tableName = typeOfPost === "Petición" ? "Petition" : "Offer";
		const userTableName = typeOfPost === "Petición" ? "User_Petition" : "User_Offer";
		const postIdColumn = typeOfPost === "Petición" ? "petition_id" : "offer_id";

		if (!currentlySubscribed) {
			const existingRelations = await GetFromDatabase({
				tableName: userTableName,
				select: "*",
				filters: [
					{ method: "eq", column: "user_id", value: user_id },
					{ method: "eq", column: postIdColumn, value: post_id },
				],
			});

			if (existingRelations.data && existingRelations.data.length > 0) {
				await PutToDatabase({
					tableName: userTableName,
					contentJson: { subscribed: true },
					filters: [
						{ method: "eq", column: "user_id", value: user_id },
						{ method: "eq", column: postIdColumn, value: post_id },
					],
				});
			} else {
				await PostToDatabase({
					tableName: userTableName,
					contentJson: {
						user_id: user_id,
						[postIdColumn]: post_id,
						liked: false,
						subscribed: true,
						email_notification: "None",
						native_notification: "None",
					},
				});
			}

			const { data, error } = await ExecuteRpcFunction<number>({
				functionName: "delta_subscribers",
				params: { post_id, target_table: tableName, given_user_id: user_id },
			});

			if (error) {
				console.error("RPC failed:", error.message);
			} else {
				console.log("New subscriber count:", data);
			}
		} else {
			await PutToDatabase({
				tableName: userTableName,
				contentJson: { subscribed: false },
				filters: [
					{ method: "eq", column: "user_id", value: user_id },
					{ method: "eq", column: postIdColumn, value: post_id },
				],
			});

			const { data, error } = await ExecuteRpcFunction<number>({
				functionName: "delta_subscribers",
				params: { post_id, target_table: tableName, given_user_id: user_id },
			});

			if (error) {
				console.error("RPC failed:", error.message);
			} else {
				console.log("New subscriber count:", data);
			}
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}

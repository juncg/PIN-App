"use server";

import { ExecuteRpcFunction, GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user";

export async function handleLikeAction(
	post_id: number,
	currentlyLiked: boolean,
	typeOfPost?: "Oferta" | "Petición" | "Review"
) {
	try {
		const user_id = await getUserUuid();

		if (!user_id) {
			throw new Error("Usuario no autenticado");
		}

		let tableName: string;
		let userTableName: string;
		let postIdColumn: string;

		switch (typeOfPost) {
			case "Petición":
				tableName = "Petition";
				userTableName = "User_Petition";
				postIdColumn = "petition_id";
				break;
			case "Oferta":
				tableName = "Offer";
				userTableName = "User_Offer";
				postIdColumn = "offer_id";
				break;
			case "Review":
				tableName = "Review";
				userTableName = "User_Review";
				postIdColumn = "review_id";
				break;
			default:
				throw new Error(`Invalid typeOfPost: ${typeOfPost}`);
		}

		if (!currentlyLiked) {
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
					contentJson: { liked: true },
					filters: [
						{ method: "eq", column: "user_id", value: user_id },
						{ method: "eq", column: postIdColumn, value: post_id },
					],
				});
			} else {
				const baseContent = {
					user_id: user_id,
					[postIdColumn]: post_id,
					liked: true,
				};

				const contentJson =
					typeOfPost === "Review"
						? baseContent
						: {
								...baseContent,
								subscribed: false,
								email_notification: "None",
								native_notification: "None",
						  };

				await PostToDatabase({
					tableName: userTableName,
					contentJson,
				});
			}

			const { data, error } = await ExecuteRpcFunction<number>({
				functionName: "delta_likes",
				params: { post_id, target_table: tableName, given_user_id: user_id },
			});

			if (error) {
				console.error("RPC failed:", error.message);
			} else {
				console.log("New like count:", data);
			}
		} else {
			await PutToDatabase({
				tableName: userTableName,
				contentJson: { liked: false },
				filters: [
					{ method: "eq", column: "user_id", value: user_id },
					{ method: "eq", column: postIdColumn, value: post_id },
				],
			});

			const { data, error } = await ExecuteRpcFunction<number>({
				functionName: "delta_likes",
				params: { post_id, target_table: tableName, given_user_id: user_id },
			});

			if (error) {
				console.error("RPC failed:", error.message);
			} else {
				console.log("New like count:", data);
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

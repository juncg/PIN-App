"use server";

import { GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user.server";

export async function handleLikeAction(post_id: number, currentlyLiked: boolean, typeOfPost?: "Oferta" | "Petición") {
	try {
		const user_id = await getUserUuid();

		if (!user_id) {
			throw new Error("Usuario no autenticado");
		}

		const tableName = typeOfPost === "Petición" ? "Petition" : "Offer";
		const userTableName = typeOfPost === "Petición" ? "User_Petition" : "User_Offer";
		const postIdColumn = typeOfPost === "Petición" ? "petition_id" : "offer_id";

		const postLikes = await GetFromDatabase<{ likes: number }>({
			tableName,
			select: "likes",
			filters: [{ method: "eq", column: "id", value: post_id }],
		});

		const currentLikes = postLikes.data && postLikes.data.length > 0 ? postLikes.data[0].likes : 0;

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
				await PostToDatabase({
					tableName: userTableName,
					contentJson: {
						user_id: user_id,
						[postIdColumn]: post_id,
						liked: true,
						subscribed: false,
						email_notification: "None",
						native_notification: "None",
					},
				});
			}

			await PutToDatabase({
				tableName,
				contentJson: { likes: currentLikes + 1 },
				filters: [{ method: "eq", column: "id", value: post_id }],
			});
		} else {
			await PutToDatabase({
				tableName: userTableName,
				contentJson: { liked: false },
				filters: [
					{ method: "eq", column: "user_id", value: user_id },
					{ method: "eq", column: postIdColumn, value: post_id },
				],
			});

			await PutToDatabase({
				tableName,
				contentJson: { likes: Math.max(0, currentLikes - 1) },
				filters: [{ method: "eq", column: "id", value: post_id }],
			});
		}

		return { success: true };
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error desconocido",
		};
	}
}

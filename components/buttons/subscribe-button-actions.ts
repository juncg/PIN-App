"use server";

import { GetFromDatabase, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { getUserUuid } from "@/lib/services/user.server";

export async function handleSubscribeAction(post_id: number, currentlySubscribed: boolean, typeOfPost?: "Oferta" | "Petición") {
	try {
		const user_id = await getUserUuid(); // comprobar si el usuario está autenticado
		if (!user_id) {
			throw new Error("Usuario no autenticado");
		}

		const tableName = typeOfPost === "Petición" ? "Petition" : "Offer"; // initializa constantes para buscar en base datos
		const userTableName = typeOfPost === "Petición" ? "User_Petition" : "User_Offer";
		const postIdColumn = typeOfPost === "Petición" ? "petition_id" : "offer_id";

		const postSubscribed = await GetFromDatabase<{ subscribed: number }>({ tableName, select: "subscribed", eq: ["id", post_id] });

		const currentSubscribed = postSubscribed[0]?.subscribed || 0;

		if (!currentlySubscribed) {
			// El usuario quiere inscribirse
			// Verificar si ya existe una relación entre el usuario y la oferta
			const existingRelations = await GetFromDatabase({ tableName: userTableName, select: "*", eq: ["user_id", user_id], additionalEqs: [[postIdColumn, post_id]] });

			if (existingRelations && existingRelations.length > 0) {
				// Si existe, actualizar el valor de subscribed a true
				await PutToDatabase({ tableName: userTableName, contentJson: { subscribed: true }, matchColumn: "user_id", matchValue: user_id, additionalMatches: [[postIdColumn, post_id]] });

			} else {
				// Si no existe, crear una nueva entrada
				await PostToDatabase({
					tableName: userTableName,
					contentJson: [{
						user_id: user_id,
						[postIdColumn]: post_id,
						liked: false,
						subscribed: true,
						email_notifications: "OnlyWhenGoalReached",

						native_notifications: "OnlyWhenGoalReached"
					}],
				});
			}

			await PutToDatabase({ tableName, contentJson: { subscribed: currentSubscribed + 1 }, matchColumn: "id", matchValue: post_id });

		} else {
			// El usuario quiere quitar la suscripción
			await PutToDatabase({ tableName: userTableName, contentJson: { subscribed: false }, matchColumn: "user_id", matchValue: user_id, additionalMatches: [[postIdColumn, post_id]] });

			await PutToDatabase({ tableName, contentJson: { subscribed: Math.max(0, currentSubscribed - 1) }, matchColumn: "id", matchValue: post_id });
		}

		return { success: true };
	} catch (error) {
		console.error("Error updating like:", error);
		return { success: false, error: error instanceof Error ? error.message : "Error desconocido" };
	}
}

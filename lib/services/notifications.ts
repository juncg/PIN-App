"use server";

import { ExecuteRpcFunction, GetFromDatabase, PostToDatabase, PutToDatabase } from "./general";
import { INotification } from "./types";
import { getUserUuid } from "./user";

interface CreateNotificationParams {
	recipientId: string;
	type: string;
	message: string;
	linkTo?: string;
	senderId?: string;
}

interface NotifyPostCompletionParams {
	postId: number;
	postTitle: string;
	type: "Offer" | "Petition";
	link: string;
}

export async function createNotification({ recipientId, type, message, linkTo, senderId }: CreateNotificationParams) {
	const newNotification = {
		user_id: recipientId,
		sender_id: senderId || null,
		type,
		message,
		is_read: false,
		link_to: linkTo || null,
	};

	const { data: result, error } = await PostToDatabase<INotification>({
		tableName: "Notification",
		contentJson: [newNotification],
	});

	if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
		console.log("[DEBUG] Notification creation result:", result, "Error:", error);
	}

	return result;
}

export async function getNotificationsForUser() {
	const userId = await getUserUuid();
	if (!userId) {
		return { data: [], error: null };
	}

	const result = await GetFromDatabase<INotification>({
		tableName: "Notification",
		select: "*, sender:sender_id(id, username, name, surnames, profile_picture)",
		filters: [
			{ method: "eq", column: "user_id", value: userId },
			{ method: "order", column: "created_at", ascending: false },
			{ method: "limit", value: 50 },
		],
	});

	return result;
}

export async function markAllAsRead() {
	const userId = await getUserUuid();
	if (!userId) {
		return { success: false, error: "Usuario no autenticado" };
	}

	try {
		const { error } = await PutToDatabase({
			tableName: "Notification",
			contentJson: { is_read: true },
			filters: [
				{ method: "eq", column: "user_id", value: userId },
				{ method: "eq", column: "is_read", value: false },
			],
		});

		return { success: !error };
	} catch (error) {
		console.error("Error al marcar todas como leídas:", error);
		return { success: false, error: "Error en la base de datos" };
	}
}

export async function notifyPostCompletion({ postId, postTitle, type, link }: NotifyPostCompletionParams) {
	const userId = await getUserUuid();
	if (!userId) {
		return { success: false, error: "Usuario no autenticado" };
	}
	const message = `¡Gran noticia! La ${type === "Offer" ? "oferta" : "petición"} "${postTitle}" ha sido completada.`;

	const result = await ExecuteRpcFunction({
		functionName: "notify_post_completion",
		params: {
			post_id: postId,
			post_type: type,
			message_text: message,
			link_url: link,
		},
	});

	return result;
}


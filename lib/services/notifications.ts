"use server";

import { GetFromDatabase, PostToDatabase, PutToDatabase } from "./general";
import { INotification } from "./types";
import { getUserUuid } from "./user";

interface CreateNotificationParams {
	recipientId: string;
	type: string;
	message: string;
	linkTo?: string;
	senderId?: string;
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
		],
	});

	return result;
}

"use client";

import { useState } from "react";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";
import { Switch } from "../ui-custom/switch";
import { Button } from "../ui-custom/button";

interface IFollowButton {
	variant?: "default" | "switch";
	followedByUser: boolean;
	entityId: number;
	entityType: "User" | "Business" | "Forum";
	currentUserId: string | null;
}

export function FollowButton({
	variant = "default",
	followedByUser,
	entityId,
	entityType,
	currentUserId,
}: IFollowButton) {
	const [followed, setFollowed] = useState<boolean>(followedByUser);
	const [showLoginDialog, setShowLoginDialog] = useState(false);

	const performFollowToggle = async () => {
		// TODO
	};

	const handleFollow = async () => {
		if (!currentUserId) {
			setShowLoginDialog(true);
			return;
		}

		await performFollowToggle();
	};

	return (
		<>
			{variant === "switch" ? (
				<Switch
					checked={followedByUser}
					onCheckedChange={() => handleFollow()}
					innerTextChecked="Siguiendo"
					innerTextUnchecked="Seguir"
					className="w-full"
				/>
			) : (
				<Button onClick={handleFollow} className="w-full">
					<span>{followedByUser ? "Dejar de seguir" : "Seguir"}</span>
				</Button>
			)}

			<NotLoggedInDialog
				open={showLoginDialog}
				onOpenChange={setShowLoginDialog}
				description="Debes iniciar sesión para seguir."
			/>
		</>
	);
}

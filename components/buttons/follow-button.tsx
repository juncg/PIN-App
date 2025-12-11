"use client";

import { useEffect, useState } from "react";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";
import { Button } from "../ui-custom/button";
import { Switch } from "../ui-custom/switch";
import { handleFollowAction } from "./follow-button-actions";

interface IFollowButton {
	variant?: "default" | "switch";
	followedByUser: boolean;
	entityId: number | string;
	entityType: "User" | "Business" | "Forum";
	currentUserId: string | null;
	followersCount?: number;
	onFollowChange?: (newCount: number) => void;
	clientTranslations?: any; //que
}

export function FollowButton({
	variant = "default",
	followedByUser,
	entityId,
	entityType,
	currentUserId,
	followersCount,
	onFollowChange,
	clientTranslations,
}: IFollowButton) {
	const [followed, setFollowed] = useState<boolean>(followedByUser);
	const [followers, setFollowers] = useState<number>(followersCount || 0);
	const [showLoginDialog, setShowLoginDialog] = useState(false);

	useEffect(() => {
		setFollowed(followedByUser);
	}, [followedByUser]);

	useEffect(() => {
		if (followersCount !== undefined) {
			setFollowers(followersCount);
		}
	}, [followersCount]);

	const handleFollow = async () => {
		if (!currentUserId) {
			setShowLoginDialog(true);
			return;
		}

		const previousFollowed = followed;
		const previousFollowers = followers;
		const newFollowedState = !followed;
		const newFollowersCount = newFollowedState ? followers + 1 : followers - 1;

		setFollowed(newFollowedState);
		setFollowers(newFollowersCount);

		try {
			const result = await handleFollowAction(entityId, entityType);

			if (!result.success) {
				setFollowed(previousFollowed);
				setFollowers(previousFollowers);
				console.error("Error al actualizar follow:", result.error);
			} else {
				const isFollowingFromServer =
					typeof result.isFollowing === "boolean" ? result.isFollowing : previousFollowed;
				const followersCountFromServer =
					typeof result.followersCount === "number" ? result.followersCount : previousFollowers;

				setFollowed(isFollowingFromServer);
				setFollowers(followersCountFromServer);

				if (onFollowChange) {
					onFollowChange(followersCountFromServer);
				}
			}
		} catch (error) {
			setFollowed(previousFollowed);
			setFollowers(previousFollowers);
			console.error("Error al actualizar follow:", error);
		}
	};

	return (
		<>
			{variant === "switch" ? (
				<Switch
					checked={followed}
					onCheckedChange={handleFollow}
					innerTextChecked={clientTranslations.followed}
					innerTextUnchecked={clientTranslations.follow}
					className="w-full"
				/>
			) : (
				<Button onClick={handleFollow} className="w-full">
					<span>{followed ? "Dejar de seguir" : "Seguir"}</span>
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

"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AnimatedLikeButton } from "../animations/like-button";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";
import { FavoriteBorderIcon, FavoriteIcon } from "../icons/icons";
import { Button } from "../ui-custom/button";
import { handleLikeAction } from "./like-button-actions";

export interface ILikeButton {
	likes: number;
	likedByUser: boolean;
	post_id: number;
	typeOfPost?: "Offer" | "Petition" | "Review";
	user_id: string | null;
	variant?: "default" | "icon" | "withtext";
	onLikeChangeForParent?: (liked: boolean) => void;
	postCreatorId?: string;
}

export function LikeButton(props: ILikeButton) {
	const { likes, likedByUser, post_id, typeOfPost, user_id, variant = "default", postCreatorId } = props;
	const [numberOfLikes, setLikes] = useState<number>(likes);
	const [liked, setLiked] = useState<boolean>(likedByUser);
	const [showLoginDialog, setShowLoginDialog] = useState(false);

	useEffect(() => {
		setLiked(likedByUser);
	}, [likedByUser]);

	useEffect(() => {
		setLikes(likes);
	}, [likes]);

	const handleLike = async () => {
		if (!user_id) {
			setShowLoginDialog(true);
			return;
		}

		const previousLiked = liked;
		const previousLikes = numberOfLikes;
		const newLikedState = !liked;
		const newLikesCount = newLikedState ? numberOfLikes + 1 : numberOfLikes - 1;

		setLiked(newLikedState);
		setLikes(newLikesCount);

		// notify parent of like state change
		if (props.onLikeChangeForParent) props.onLikeChangeForParent(newLikedState);

		try {
			await handleLikeAction(post_id, previousLiked, typeOfPost, postCreatorId);
		} catch (error) {
			setLiked(previousLiked);
			setLikes(previousLikes);
			console.error("Error al actualizar like:", error);
		}
	};

	if (variant === "withtext") {
		return (
			<>
				<Button
					onClick={handleLike}
					variant="ghost"
					className={cn(
						"flex items-center gap-2 px-4 py-2 rounded-full transition-all bg-transparent hover:bg-transparent border-none"
					)}
				>
					{liked ? (
						<FavoriteIcon className="!h-5 !w-5 text-destructive" />
					) : (
						<FavoriteBorderIcon className="!h-5 !w-5" />
					)}
					<span className="font-medium">Me gusta</span>
				</Button>

				<NotLoggedInDialog
					open={showLoginDialog}
					onOpenChange={setShowLoginDialog}
					description="Debes iniciar sesión para darle like a esta publicación."
				/>
			</>
		);
	}

	if (variant === "icon") {
		return (
			<>
				<AnimatedLikeButton
					liked={liked}
					onClick={handleLike}
					className={cn("bg-white text-darkmode hover:text-destructive transition")}
				/>

				<NotLoggedInDialog
					open={showLoginDialog}
					onOpenChange={setShowLoginDialog}
					description="Debes iniciar sesión para darle like a esta publicación."
				/>
			</>
		);
	}

	return (
		<>
			<div className="flex items-center gap-1.5 group cursor-pointer hover:text-destructive transition-colors" onClick={handleLike}>
				<AnimatedLikeButton liked={liked} onClick={() => {}} className="h-4 w-4 p-0 bg-transparent" />
				<span>{numberOfLikes || 0}</span>
			</div>

			<NotLoggedInDialog
				open={showLoginDialog}
				onOpenChange={setShowLoginDialog}
				description="Debes iniciar sesión para darle like a esta publicación."
			/>
		</>
	);
}

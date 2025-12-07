"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";
import { FavoriteBorderIcon, FavoriteIcon } from "../icons/icons";
import { Button } from "../ui-custom/button";
import { handleLikeAction } from "./like-button-actions";

export interface ILikeButton {
	likes: number;
	likedByUser: boolean;
	post_id: number;
	typeOfPost?: "Oferta" | "Petición" | "Review";
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
				<Button
					onClick={handleLike}
					className={cn(
						"h-8 w-8 rounded-full p-0 bg-white text-darkmode hover:text-destructive transition",
						liked ? "text-destructive" : "hover:text-destructive"
					)}
				>
					{liked ? (
						<FavoriteIcon className={cn("!h-5 !w-5 text-destructive")} />
					) : (
						<FavoriteBorderIcon className={cn("!h-5 !w-5")} />
					)}
				</Button>

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
			<Button variant="outline" className={cn("mt-4")} onClick={handleLike}>
				{liked ? (
					<FavoriteIcon className={cn("mr-2 !h-5 !w-5 text-destructive")} />
				) : (
					<FavoriteBorderIcon className={cn("mr-2 !h-5 !w-5")} />
				)}
				{numberOfLikes || 0}
			</Button>

			<NotLoggedInDialog
				open={showLoginDialog}
				onOpenChange={setShowLoginDialog}
				description="Debes iniciar sesión para darle like a esta publicación."
			/>
		</>
	);
}

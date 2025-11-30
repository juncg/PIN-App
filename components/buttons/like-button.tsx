"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { handleLikeAction } from "./like-button-actions";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";
import { Heart } from "lucide-react";

export interface ILikeButton {
	likes: number;
	likedByUser: boolean;
	post_id: number;
	typeOfPost?: "Oferta" | "Petición" | "Review";
	user_id: string | null;
	variant?: "default" | "icon";
	onLikeChangeForParent?: (liked: boolean) => void;
}

export function LikeButton(props: ILikeButton) {
	const { likes, likedByUser, post_id, typeOfPost, user_id, variant = "default" } = props;
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
			await handleLikeAction(post_id, previousLiked, typeOfPost);
		} catch (error) {
			setLiked(previousLiked);
			setLikes(previousLikes);
			console.error("Error al actualizar like:", error);
		}
	};

	if (variant === "icon") {
		return (
			<>
				<Button
					onClick={handleLike}
					className={cn(
						"h-8 w-8 rounded-full bg-background/80 p-0 text-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-red-500",
						liked ? "text-red-500" : "text-foreground hover:text-red-500"
					)}
					variant="ghost"
				>
					<Heart className={cn("h-4 w-4", liked && "fill-current text-red-500")} />
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
				<Heart className={cn("mr-2", liked && "fill-red-500 text-red-500")} />
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

"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { handleLikeAction } from "./like-button-actions";

export interface ILikeButton {
	likes: number;
	likedByUser: boolean;
	post_id: number;
	typeOfPost?: "Oferta" | "Petición";
}

export function LikeButton(props: ILikeButton) {
	const { likes, likedByUser, post_id, typeOfPost } = props;
	const [numberOfLikes, setLikes] = useState<number>(likes);
	const [liked, setLiked] = useState<boolean>(likedByUser);

	const handleLike = async () => {
		const newLikedState = !liked;
		const newLikesCount = newLikedState ? numberOfLikes + 1 : numberOfLikes - 1;

		setLiked(newLikedState);
		setLikes(newLikesCount);

		try {
			await handleLikeAction(post_id, liked, typeOfPost);
		} catch (error) {
			setLiked(liked);
			setLikes(numberOfLikes);
			console.error("Error al actualizar like:", error);
		}
	};

	return (
		<Button variant="outline" className="mt-4" onClick={handleLike}>
			<Heart className={cn("mr-2", liked && "fill-red-500 text-red-500")} />
			{numberOfLikes || 0}
		</Button>
	);
}

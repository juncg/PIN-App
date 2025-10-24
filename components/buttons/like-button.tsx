"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { handleLikeAction } from "./like-button-actions";

export interface ILikeButton {
  likes: number;
  likedByUser?: boolean;
  post_id: number;
  typeOfPost?: "Oferta" | "Petición";
}

export function LikeButton({ props }: { props: ILikeButton }) {
  const { likes, likedByUser, post_id, typeOfPost } = props;
  const [numberOfLikes, setLikes] = useState<number>(likes);
  const [liked, setLiked] = useState<boolean>(likedByUser || false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    const newLikedState = !liked;
    const newLikesCount = newLikedState ? numberOfLikes + 1 : numberOfLikes - 1;

    setLiked(newLikedState);
    setLikes(newLikesCount);
    setIsLoading(true);

    try {
      const result = await handleLikeAction(post_id, liked, typeOfPost);

      console.log("Resultado de la acción:", result);

      if (!result.success) {
        // Revertir cambios si falla
        setLiked(liked);
        setLikes(numberOfLikes);
        console.error("Error al actualizar like:", result.error);
      }
    } catch (error) {
      // Revertir cambios si falla
      setLiked(liked);
      setLikes(numberOfLikes);
      console.error("Error al actualizar like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="mt-4"
      onClick={handleLike}
      disabled={isLoading}
    >
      <Heart className={cn("mr-2", liked && "fill-red-500 text-red-500")} />
      {numberOfLikes || 0}
    </Button>
  );
}

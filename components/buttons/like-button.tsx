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
}

export function LikeButton(props: ILikeButton) {
    const { likes, likedByUser, post_id, typeOfPost, user_id } = props;
    const [numberOfLikes, setLikes] = useState<number>(likes);
    const [liked, setLiked] = useState<boolean>(likedByUser);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    //const [isPending, setIsPending] = useState(false);

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

        // Prevent multiple clicks while processing
        //if (isPending) return;

        const previousLiked = liked;
        const previousLikes = numberOfLikes;
        const newLikedState = !liked;
        const newLikesCount = newLikedState ? numberOfLikes + 1 : numberOfLikes - 1;

        setLiked(newLikedState);
        setLikes(newLikesCount);
        //setIsPending(true);

        try {
            await handleLikeAction(post_id, previousLiked, typeOfPost);
        } catch (error) {
            // Rollback on error
            setLiked(previousLiked);
            setLikes(previousLikes);
            console.error("Error al actualizar like:", error);
        } finally {
            //setIsPending(false);
        }
    };

    return (
        <>
            <Button 
                variant="outline" 
                className="mt-4" 
                onClick={handleLike}
                //disabled={isPending}
            >
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

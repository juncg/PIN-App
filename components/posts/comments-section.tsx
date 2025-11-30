"use client";

import { NotLoggedInDialog } from "@/components/dialogs/not-logged-in-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Button } from "@/components/ui-custom/button";
import { Separator } from "@/components/ui-custom/separator";
import { Textarea } from "@/components/ui-custom/textarea";
import { H3 } from "@/components/ui-custom/typography";
import { PostToDatabase } from "@/lib/services/general";
import { IComment, IUser } from "@/lib/services/types";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CommentCard } from "../cards/comment-card";

interface CommentsSectionProps {
	postId: number;
	postType: "Petition" | "Offer";
	comments?: IComment[];
	currentUser?: IUser | null;
}

export function CommentsSection({
	postId,
	postType,
	comments: initialComments = [],
	currentUser,
}: CommentsSectionProps) {
	const [comments, setComments] = useState<IComment[]>(initialComments);
	const [newComment, setNewComment] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showLoginDialog, setShowLoginDialog] = useState(false);

	useEffect(() => {
		setComments(initialComments);
	}, [initialComments]);

	const handleSubmit = async () => {
		if (!currentUser) {
			setShowLoginDialog(true);
			return;
		}

		if (!newComment.trim()) {
			toast.error("El comentario no puede estar vacío");
			return;
		}

		setIsSubmitting(true);
		try {
			const commentData: Omit<IComment, "id"> = {
				text: newComment,
				created_at: new Date().toISOString(),
				creator_id: currentUser.id,
				forum_id: null,
				likes: 0,
				superlikes: 0,
				comment_locked_state: "Unlocked",
				state: "Posted",
			};

			const { data: response, error } = await PostToDatabase({
				tableName: "Comment",
				contentJson: [commentData],
			});

			if (error || !response) {
				console.log("Error al publicar comentario:", error);
				toast.error("Error al publicar comentario");
				return;
			}

			const { error: postError } = await PostToDatabase({
				tableName: "Comment_Post",
				contentJson: [
					{
						comment_id: response[0].id,
						offer_id: postType === "Offer" ? postId : null,
						petition_id: postType === "Petition" ? postId : null,
						referenced_comment_id: null,
						review_id: null,
					},
				],
			});

			if (postError) {
				console.log("Error al vincular comentario:", postError);
				toast.error("Error al publicar comentario");
				return;
			}

			const newCommentWithUser: IComment = {
				...response[0],
				user: currentUser || undefined,
				replies: [],
			};

			setComments((prevComments) => [newCommentWithUser, ...prevComments]);

			toast.success("Comentario publicado");
			setNewComment("");
		} catch (error) {
			toast.error("Error al publicar comentario");
		} finally {
			setIsSubmitting(false);
		}
	};

	const totalComments = comments.reduce((acc, comment) => {
		return acc + 1 + (comment.replies?.length || 0);
	}, 0);

	return (
		<div className="space-y-6 mt-12">
			<div className="flex items-center gap-2">
				<H3>Comentarios</H3>
				<div className="bg-lightgrey px-2 py-0.5 rounded-full text-xs font-medium">{totalComments}</div>
			</div>

			<Separator />

			<div className="flex gap-4">
				<Avatar className="flex-shrink-0">
					<AvatarImage className="object-cover" src={currentUser?.profile_picture || undefined} />
					<AvatarFallback>{currentUser?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
				</Avatar>
				<div className="flex-1 space-y-2">
					<Textarea
						placeholder={currentUser ? "Escribe un comentario..." : "Inicia sesión para comentar"}
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						disabled={isSubmitting || !currentUser}
						className="min-h-[100px] resize-none"
					/>
					<div className="flex justify-end">
						<Button
							onClick={handleSubmit}
							disabled={isSubmitting || !newComment.trim() || !currentUser}
							size="sm"
						>
							{isSubmitting ? (
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							) : (
								<Plus className="h-4 w-4 mr-2" />
							)}
							Publicar
						</Button>
					</div>
				</div>
			</div>

			<div className="space-y-6">
				{comments.length > 0 ? (
					comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
				) : (
					<div className="text-center py-12 ">
						<B1 className="text-lightgrey">No hay comentarios todavía. ¡Sé el primero en comentar!</B1>
					</div>
				)}
			</div>

			<NotLoggedInDialog
				open={showLoginDialog}
				onOpenChange={setShowLoginDialog}
				description="Necesitas iniciar sesión para publicar un comentario."
			/>
		</div>
	);
}

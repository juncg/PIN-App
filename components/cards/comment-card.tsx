"use client";

import { IComment, IUser } from "@/lib/services/types";
import { GetRelativeTime } from "@/lib/services/utilities";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";
import { B1 } from "../ui-custom/typography";
import { PostToDatabase } from "@/lib/services/general";
import { CommentBox } from "../comments/comment-box";
import { fetchCommentReplies } from "@/app/shared-services/post-shared-services";
import { Button } from "../ui-custom/button";

interface CommentCardProps {
	comment: IComment;
	level?: number;
	currentUser?: IUser | null;
	postId: number;
	onReplyAdded?: (parentId: number, newReply: IComment) => void;
	maxDepth?: number;
}

const MAX_NEST_DEPTH = 3;

export function CommentCard({
	comment,
	level = 0,
	currentUser,
	postId,
	onReplyAdded,
	maxDepth = MAX_NEST_DEPTH,
}: CommentCardProps) {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [replies, setReplies] = useState<IComment[]>(comment.replies || []);
	const [showReplies, setShowReplies] = useState(false);
	const [isLoadingReplies, setIsLoadingReplies] = useState(false);
	const [replyCount, setReplyCount] = useState(comment.replyCount || 0);

	// Check if we've reached max depth
	const isMaxDepth = level >= maxDepth;

	const handleReplyClick = () => {
		if (!currentUser) {
			toast.error("Debes iniciar sesión para responder");
			return;
		}
		setShowReplyForm(!showReplyForm);
	};

	const handleShowReplies = async () => {
		if (showReplies) {
			setShowReplies(false);
			return;
		}

		if (replies.length === 0) {
			setIsLoadingReplies(true);
			try {
				const { replies: fetchedReplies, error } = await fetchCommentReplies(comment.id);

				if (error) {
					toast.error("Error al cargar respuestas");
					return;
				}

				setReplies(fetchedReplies);
				setShowReplies(true);
			} catch (error) {
				toast.error("Error al cargar respuestas");
				console.error(error);
			} finally {
				setIsLoadingReplies(false);
			}
		} else {
			setShowReplies(true);
		}
	};

	const handleReplySubmit = async () => {
		if (!currentUser) {
			toast.error("Debes iniciar sesión para responder");
			return;
		}

		if (!replyText.trim()) {
			toast.error("El comentario no puede estar vacío");
			return;
		}

		setIsSubmitting(true);
		try {
			const replyData: Omit<IComment, "id"> = {
				text: replyText,
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
				contentJson: [replyData],
			});

			if (error || !response) {
				toast.error("Error al publicar respuesta");
				console.error(error);
				return;
			}

			const { error: postError } = await PostToDatabase({
				tableName: "Comment_Post",
				contentJson: [
					{
						comment_id: response[0].id,
						offer_id: null,
						petition_id: null,
						referenced_comment_id: comment.id,
						review_id: null,
					},
				],
			});

			if (postError) {
				toast.error("Error al publicar respuesta");
				return;
			}

			const newReply: IComment = {
				...response[0],
				user: currentUser,
				replies: [],
				replyCount: 0,
			};

			setReplies((prev) => [newReply, ...prev]);
			setReplyCount((prev) => prev + 1);

			if (onReplyAdded) {
				onReplyAdded(comment.id, newReply);
			}

			toast.success("Respuesta publicada");
			setReplyText("");
			setShowReplyForm(false);
			setShowReplies(true);
		} catch (error) {
			toast.error("Error al publicar respuesta");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleNestedReplyAdded = (parentId: number, newReply: IComment) => {
		setReplies((prev) =>
			prev.map((reply) =>
				reply.id === parentId
					? {
							...reply,
							replies: [newReply, ...(reply.replies || [])],
							replyCount: (reply.replyCount || 0) + 1,
					  }
					: reply
			)
		);
	};

	return (
		<div className={`flex gap-4 group ${level > 0 ? "ml-12 mt-4" : ""}`}>
			<Avatar className="h-10 w-10 border flex-shrink-0">
				<AvatarImage className="object-cover" src={comment.user?.profile_picture || undefined} />
				<AvatarFallback>{comment.user?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
			</Avatar>
			<div className="flex-1 space-y-2">
				<div className="flex items-center gap-2">
					<span className="font-semibold text-sm">
						{comment.user?.name} {comment.user?.surnames}
					</span>
					<span className="text-xs text-lightgrey">@{comment.user?.username}</span>
					<span className="text-xs text-lightgrey">· {GetRelativeTime(comment.created_at)}</span>
				</div>
				<B1 className="text-sm text-white/90 whitespace-pre-wrap">{comment.text}</B1>

				<div className="flex items-center gap-4 text-xs text-lightgrey">
					<button
						className="hover:text-white transition-colors flex items-center gap-1"
						onClick={handleReplyClick}
					>
						<MessageSquare className="h-3 w-3" />
						Responder
					</button>
					{!isMaxDepth && replyCount > 0 && (
						<button
							className="hover:text-white transition-colors flex items-center gap-1"
							onClick={handleShowReplies}
							disabled={isLoadingReplies}
						>
							<MessageSquare className="h-3 w-3" />
							{isLoadingReplies
								? "Cargando..."
								: showReplies
								? "Ocultar respuestas"
								: `Ver ${replyCount} ${replyCount === 1 ? "respuesta" : "respuestas"}`}
						</button>
					)}

					{/* continue thread at max depth */}
					{isMaxDepth && replyCount > 0 && (
						<Button
							variant="link"
							className="text-xs text-blue-400 hover:text-blue-300 p-0 h-auto"
							onClick={() => {
								// this should reload comments section on new comment
								// or do: window.location.href = `/comments/${comment.id}`;
							}}
						>
							Continuar hilo →
						</Button>
					)}
				</div>

				{showReplyForm && (
					<div className="pt-2">
						<CommentBox
							currentUser={currentUser}
							newComment={replyText}
							setNewComment={setReplyText}
							isSubmitting={isSubmitting}
							handleSubmit={handleReplySubmit}
							placeholder={`Responder a @${comment.user?.username}...`}
						/>
					</div>
				)}

				{showReplies && replies.length > 0 && (
					<div className="space-y-4 pt-2">
						{replies.map((reply) => (
							<CommentCard
								key={reply.id}
								comment={reply}
								level={level + 1}
								currentUser={currentUser}
								postId={postId}
								onReplyAdded={handleNestedReplyAdded}
								maxDepth={maxDepth}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

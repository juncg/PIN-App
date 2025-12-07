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

interface CommentCardProps {
	comment: IComment;
	level?: number;
	currentUser?: IUser | null;
	postId: number;
	onReplyAdded?: (parentId: number, newReply: IComment) => void;
	parentComment?: IComment;
}

export function CommentCard({
	comment,
	level = 0,
	currentUser,
	postId,
	onReplyAdded,
	parentComment,
}: CommentCardProps) {
	const [showReplyForm, setShowReplyForm] = useState(false);
	const [replyText, setReplyText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [replies, setReplies] = useState<IComment[]>(comment.replies || []);
	const [showReplies, setShowReplies] = useState(false);
	const [isLoadingReplies, setIsLoadingReplies] = useState(false);
	const [replyCount, setReplyCount] = useState(comment.replyCount || 0);

	const isTopLevel = level === 0;
	const parentCommentId = parentComment?.id || comment.id;

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

		if (replies.length === 0 && isTopLevel) {
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
				console.error("Error creating comment:", error);
				toast.error("Error al publicar respuesta");
				return;
			}

			if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
				console.log("Creating Comment_Post with:", {
					comment_id: response[0].id,
					referenced_comment_id: parentCommentId,
					referenced_user_id: comment.user?.id,
				});
			}

			const { error: postError } = await PostToDatabase({
				tableName: "Comment_Post",
				contentJson: [
					{
						comment_id: response[0].id,
						offer_id: null,
						petition_id: null,
						referenced_comment_id: parentCommentId,
						referenced_user_id: comment.user?.id || null,
						review_id: null,
					},
				],
			});

			if (postError) {
				console.error("Error creating Comment_Post:", postError);
				toast.error("Error al publicar respuesta");
				return;
			}

			const newReply: IComment = {
				...response[0],
				user: currentUser,
				referencedUser: comment.user,
				replies: [],
				replyCount: 0,
			};

			console.log("New reply created with referencedUser:", newReply.referencedUser?.username);

			if (isTopLevel) {
				setReplies((prev) => [newReply, ...prev]);
				setReplyCount((prev) => prev + 1);
			}

			if (onReplyAdded) {
				onReplyAdded(parentCommentId, newReply);
			}

			toast.success("Respuesta publicada");
			setReplyText("");
			setShowReplyForm(false);

			if (isTopLevel) {
				setShowReplies(true);
			}
		} catch (error) {
			console.error("Error in handleReplySubmit:", error);
			toast.error("Error al publicar respuesta");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleNestedReplyAdded = (parentId: number, newReply: IComment) => {
		if (isTopLevel) {
			setReplies((prev) => [newReply, ...prev]);
			setReplyCount((prev) => prev + 1);
		}
	};

	return (
		<div className={`flex gap-4 group ${level > 0 ? "ml-12 mt-4" : ""}`}>
			<Avatar className="h-10 w-10 border flex-shrink-0">
				<AvatarImage className="object-cover" src={comment.user?.profile_picture || undefined} />
				<AvatarFallback>{comment.user?.name?.[0].toUpperCase() || "U"}</AvatarFallback>
			</Avatar>

			<div className="flex-1 space-y-2">
				<div className="flex items-center gap-2 flex-wrap">
					<span className="font-semibold text-sm">
						{comment.user?.name} {comment.user?.surnames}
					</span>
					<span className="text-xs text-lightgrey">@{comment.user?.username}</span>
					{comment.referencedUser && (
						<>
							<span className="text-xs text-lightgrey">·</span>
							<span className="text-xs text-lightgrey">
								respondiendo a{" "}
								<span className="text-blue-400">@{comment.referencedUser.username}</span>
							</span>
						</>
					)}
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

					{isTopLevel && replyCount > 0 && (
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
				</div>

				{showReplyForm && (
					<div className="pt-2 space-y-2">
						<div className="text-xs text-lightgrey">
							Respondiendo a{" "}
							<span className="text-blue-400 font-medium">@{comment.user?.username}</span>
						</div>
						<CommentBox
							currentUser={currentUser}
							newComment={replyText}
							setNewComment={setReplyText}
							isSubmitting={isSubmitting}
							handleSubmit={handleReplySubmit}
						/>
					</div>
				)}

				{isTopLevel && showReplies && replies.length > 0 && (
					<div className="space-y-4 pt-2">
						{replies.map((reply) => (
							<CommentCard
								key={reply.id}
								comment={reply}
								level={1}
								currentUser={currentUser}
								postId={postId}
								onReplyAdded={handleNestedReplyAdded}
								parentComment={comment}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

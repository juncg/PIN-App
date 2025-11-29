"use client";

import { IComment } from "@/lib/services/types";
import { GetRelativeTime } from "@/lib/services/utilities";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { P } from "../ui-custom/typography";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function CommentCard({ comment, level = 0 }: { comment: IComment; level?: number }) {
	const [showReplyForm, setShowReplyForm] = useState(false);

	const handleReplyClick = () => {
		toast.info("Esta función no está implementada actualmente");
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
					<span className="text-xs text-muted">@{comment.user?.username}</span>
					<span className="text-xs text-muted">· {GetRelativeTime(comment.created_at)}</span>
				</div>
				<P className="text-sm text-white/90 whitespace-pre-wrap">{comment.text}</P>

				<div className="flex items-center gap-4 text-xs text-muted">
					<button
						className="hover:text-white transition-colors flex items-center gap-1"
						onClick={handleReplyClick}
					>
						<MessageSquare className="h-3 w-3" />
						Responder
					</button>
					{comment.replies && comment.replies.length > 0 && (
						<span className="flex items-center gap-1">
							<MessageSquare className="h-3 w-3" />
							{comment.replies.length} {comment.replies.length === 1 ? "respuesta" : "respuestas"}
						</span>
					)}
				</div>

				{comment.replies && comment.replies.length > 0 && (
					<div className="space-y-4 pt-2">
						{comment.replies.map((reply) => (
							<CommentCard key={reply.id} comment={reply} level={level + 1} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

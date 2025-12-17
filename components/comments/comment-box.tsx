import { Button } from "@/components/ui-custom/button";
import { Textarea } from "@/components/ui-custom/textarea";
import { IUser } from "@/lib/services/types";
import { Loader2, Plus } from "lucide-react";

export function CommentBox({
    currentUser,
    newComment,
    isSubmitting,
    handleSubmit,
    setNewComment,
    commentsLocked = false,
}: {
    currentUser: IUser | null | undefined;
    newComment: string;
    isSubmitting: boolean;
    handleSubmit: () => Promise<void>;
    setNewComment: (value: string) => void;
    commentsLocked?: boolean;
}) {
	return (
		<div className="flex-1 space-y-2">
			<Textarea
				placeholder={
					commentsLocked
						? "Los comentarios están deshabilitados"
						: currentUser
						? "Escribe un comentario..."
						: "Inicia sesión para comentar"
				}
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				disabled={isSubmitting || !currentUser || commentsLocked}
				className="min-h-[100px] resize-none"
			/>
			<div className="flex justify-end">
				<Button
					onClick={handleSubmit}
					disabled={isSubmitting || !newComment.trim() || !currentUser || commentsLocked}
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
	);
}
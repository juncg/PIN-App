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
}: {
    currentUser: IUser | null | undefined;
    newComment: string;
    isSubmitting: boolean;
    handleSubmit: () => Promise<void>;
    setNewComment: (value: string) => void;
}) {
	return (
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
	);
}
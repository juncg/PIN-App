"use client";

import { Check, MoreHorizontal, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IReview } from "@/lib/services/types";
import { Separator } from "../ui/separator";
import { LikeButton } from "../buttons/like-button";
import { useUser } from "@/hooks/use-user";
import { GetRelativeTime } from "@/lib/services/utilities";
import { PostActionsDropdown } from "../buttons/post-actions-button";
import { DeleteFromDatabase, ExecuteRpcFunction } from "@/lib/services/general";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductReviewForm } from "../forms/product-review-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UserReviewCardProps {
	review: IReview;
	currentUserId?: string;
	productId: number;
}

export function UserReviewCard({ review, currentUserId, productId }: UserReviewCardProps) {
	const router = useRouter();
	const { userUuid } = useUser();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const likedByUser =
		review.User_Review?.some((userReview) => userReview.user_id === userUuid && userReview.liked) ?? false;
	const isOwner = currentUserId ? review.creator_id === currentUserId : false;

	const handleDeleteReview = async () => {
		try {
			const { error } = await DeleteFromDatabase({
				tableName: "Review",
				matchColumn: "id",
				matchValue: review.id,
			});

			if (error) {
				throw new Error(error.message || "Error al eliminar la reseña");
			}

			const { error: updateError } = await ExecuteRpcFunction({
				functionName: "update_product_rating",
				params: { p_product_id: productId },
			});

			if (updateError) {
				console.error("Error updating product rating:", updateError);
			}

			toast.success("Reseña eliminada correctamente");
			router.refresh();
		} catch (error) {
			console.error("Error deleting review:", error);
			toast.error("Error al eliminar la reseña");
		}
	};

	const handleEditSuccess = () => {
		setIsEditDialogOpen(false);
		router.refresh();
	};

	return (
		<>
			<Card className="p-6">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12">
							<AvatarImage src="/placeholder.png" />
							<AvatarFallback>{review.user?.username}</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex items-center gap-2 mb-1">
								<span className="font-semibold ">
									{review.creator_id === userUuid
										? "Tú"
										: review.user?.name + " " + review.user?.surnames}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${
												i < (review.stars ?? 0)
													? "fill-amber-500 text-amber-500"
													: "text-muted-foreground"
											}`}
										/>
									))}
								</div>
								<span className="text-sm text-muted-foreground">
									{GetRelativeTime(review.created_at)}
								</span>
							</div>
						</div>
					</div>

					<PostActionsDropdown
						isOwner={isOwner}
						onEdit={() => setIsEditDialogOpen(true)}
						onDelete={handleDeleteReview}
						onReport={() => {
							/* aqui no pasa nada */
						}}
					/>
				</div>

				<h4 className="font-semibold mb-2">{review.title}</h4>
				<p className="text-muted-foreground mb-4">{review.content}</p>

				<Separator />

				<div className="flex flex-row justify-between">
					<div className="flex flex-row justify-start gap-6">
						<LikeButton
							likes={review.likes ?? 0}
							likedByUser={likedByUser}
							post_id={review.id}
							typeOfPost={"Review"}
							user_id={userUuid}
						/>
					</div>
				</div>
			</Card>

			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Editar reseña</DialogTitle>
						<DialogDescription>Modifica tu reseña sobre este producto</DialogDescription>
					</DialogHeader>
					<ProductReviewForm
						onCancel={() => setIsEditDialogOpen(false)}
						onSuccess={handleEditSuccess}
						userUuid={userUuid || ""}
						productId={productId}
						existingReview={review}
					/>
				</DialogContent>
			</Dialog>
		</>
	);
}

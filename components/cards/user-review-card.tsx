"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui-custom/dialog";
import { useUser } from "@/hooks/use-user";
import { DeleteFromDatabase, ExecuteRpcFunction } from "@/lib/services/general";
import { IReview } from "@/lib/services/types";
import { GetRelativeTime } from "@/lib/services/utilities";
import { Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { LikeButton } from "../buttons/like-button";
import { PostActionsDropdown } from "../buttons/post-actions-button";
import { ProductReviewForm } from "../forms/product-review-form";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";
import { Card } from "../ui-custom/card";
import { Separator } from "../ui-custom/separator";

interface UserReviewCardProps {
	review: IReview;
	currentUserId?: string;
	productId: number;
}

export function UserReviewCard({ review, currentUserId, productId }: UserReviewCardProps) {
	const router = useRouter();
	const { userUuid } = useUser();
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
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
			<Card className="p-6 h-[240px] flex flex-col">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12">
							<AvatarImage className="object-cover" src={review.user?.profile_picture || undefined} />
							<AvatarFallback>{review.user?.username}</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex flex-col">
								<span className="font-semibold text-lg">
									{review.creator_id === userUuid
										? "Tú"
										: review.user?.name + " " + review.user?.surnames}
								</span>
								<span className="text-sm text-lightgrey">{GetRelativeTime(review.created_at)}</span>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-4 w-4 ${
									i < (review.stars ?? 0) ? "fill-white text-white" : "text-zinc-700"
								}`}
							/>
						))}
					</div>
				</div>

				<p className="text-lightgrey mb-4 line-clamp-3 flex-1">{review.content}</p>

				<div className="flex items-center justify-between mt-auto">
					<button
						onClick={() => setIsReadMoreOpen(true)}
						className="text-sm text-white hover:underline flex items-center gap-1"
					>
						Leer más <Plus className="h-3 w-3" />
					</button>

					{isOwner && (
						<PostActionsDropdown
							isOwner={isOwner}
							onEdit={() => setIsEditDialogOpen(true)}
							onDelete={handleDeleteReview}
							onReport={() => {
								/* aqui no pasa nada */
							}}
						/>
					)}
				</div>
			</Card>

			<Dialog open={isReadMoreOpen} onOpenChange={setIsReadMoreOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<div className="flex items-center gap-3 mb-4">
							<Avatar className="h-12 w-12">
								<AvatarImage className="object-cover" src={review.user?.profile_picture || undefined} />
								<AvatarFallback>{review.user?.username}</AvatarFallback>
							</Avatar>
							<div>
								<div className="flex flex-col">
									<span className="font-semibold text-lg">
										{review.creator_id === userUuid
											? "Tú"
											: review.user?.name + " " + review.user?.surnames}
									</span>
									<div className="flex items-center gap-2">
										<span className="text-sm text-lightgrey">
											{GetRelativeTime(review.created_at)}
										</span>
										<div className="flex items-center gap-1 ml-2">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`h-3 w-3 ${
														i < (review.stars ?? 0)
															? "fill-white text-white"
															: "text-zinc-700"
													}`}
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					</DialogHeader>

					<div className="space-y-4">
						<h4 className="font-semibold text-xl">{review.title}</h4>
						<p className="text-lightgrey whitespace-pre-wrap">{review.content}</p>

						<Separator />

						<div className="flex flex-row justify-between items-center">
							<LikeButton
								likes={review.likes ?? 0}
								likedByUser={likedByUser}
								post_id={review.id}
								typeOfPost={"Review"}
								user_id={userUuid}
							/>
						</div>
					</div>
				</DialogContent>
			</Dialog>

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

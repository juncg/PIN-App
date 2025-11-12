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

interface UserReviewCardProps {
	review: IReview;
}

export function UserReviewCard({ review }: UserReviewCardProps) {
	const { userUuid } = useUser();
	const likedByUser =
		review.User_Review?.some((userReview) => userReview.user_id === userUuid && userReview.liked) ?? false;

	const handleDeleteReview = async () => {
		const { error } = await DeleteFromDatabase({ tableName: "Review", matchColumn: "id", matchValue: review.id });
		if (error) {
			console.error("Error al eliminar la reseña:", error);
		}
		const { error: updateError } = await ExecuteRpcFunction({
			functionName: "update_product_rating",
			params: { p_product_id: review.Review_Product?.[0]?.product_id },
		});

		if (updateError) {
			throw new Error(updateError.message || "Error al actualizar la calificación del producto");
		}

		window.location.reload();
	};

	console.log("Review in UserReviewCard:", review);

	return (
		<Card key={1} className="p-6">
			<div className="flex items-start justify-between mb-4">
				<div className="flex items-center gap-3">
					<Avatar className="h-12 w-12">
						<AvatarImage src="/placeholder.png" />
						<AvatarFallback>{review.user?.username}</AvatarFallback>
					</Avatar>
					<div>
						<div className="flex items-center gap-2 mb-1">
							<span className="font-semibold ">
								{review.user?.id === userUuid ? "Tú" : review.user?.name + " " + review.user?.surnames}
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
							<span className="text-sm text-muted-foreground">{GetRelativeTime(review.created_at)}</span>
						</div>
					</div>
				</div>

				<PostActionsDropdown
					isOwner={review.user?.id === userUuid}
					onEdit={() => {
						/* Implement edit functionality */
					}}
					onDelete={handleDeleteReview}
					onReport={() => {
						/* Implement report functionality */
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
	);
}

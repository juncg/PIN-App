import { Check, MoreHorizontal, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { IReview } from "@/lib/services/types";
import { Separator } from "../ui/separator";
import { LikeButton } from "../buttons/like-button";
import { useUser } from "@/hooks/use-user";

interface UserReviewCardProps {
	review: IReview;
}

//intencion de mover a otro archivo para poder usarlo con otros componentes, ademas de permitir traducciones.
function GetRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInDays / 365);

	if (diffInMinutes < 1) return "Ahora mismo";
	if (diffInMinutes < 60) return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
	if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
	if (diffInDays < 30) return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
	if (diffInMonths < 12) return `Hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`;
	return `Hace ${diffInYears} ${diffInYears === 1 ? "año" : "años"}`;
}

export function UserReviewCard({ review }: UserReviewCardProps) {
	const { userUuid } = useUser();
	const likedByUser = review.User_Review?.some((u) => u.user_id === userUuid && u.liked);

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
							<span className="font-semibold ">{review.user?.name + " " + review.user?.surnames}</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`h-4 w-4 ${
											i < review.stars ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
										}`}
									/>
								))}
							</div>
							<span className="text-sm text-muted-foreground">{GetRelativeTime(review.created_at)}</span>
						</div>
					</div>
				</div>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</div>

			<h4 className="font-semibold mb-2">{review.title}</h4>
			<p className="text-muted-foreground mb-4">{review.content}</p>

			<Separator />

			<div className="flex flex-row justify-between">
				<div className="flex flex-row justify-start gap-6">
					<LikeButton
						likes={review.likes ?? 0}
						likedByUser={likedByUser ?? false}
						post_id={review.id}
						typeOfPost={"Review"}
						user_id={userUuid}
					/>
				</div>
			</div>
		</Card>
	);
}

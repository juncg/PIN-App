"use client";

import { useUser } from "@/hooks/use-user";
import { BASE_DOMAIN } from "@/lib/constants";
import { IOffer, IPetition } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Timer, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { PopOutMedia } from "../floating-panels/pop-out-media";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui-custom/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Progress } from "../ui/progress";
import { GetTimeRemaining } from "@/lib/services/utilities";

export interface IPostCard {
	className?: string;
	post: IOffer | IPetition;
	images?: string[];
}

export function PostCard(props: IPostCard) {
	const { post, className, images } = props;
	const { userUuid } = useUser();
	const [currentProgress, setCurrentProgress] = useState(post.current_progress);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [startIndex, setStartIndex] = useState(0);

	useEffect(() => {
		setCurrentProgress(post.current_progress);
	}, [post.current_progress]);

	const subscribedByUser =
		post.type === "Offer"
			? !!(post as IOffer).User_Offer?.some((u) => u.user_id === userUuid && u.subscribed)
			: !!(post as IPetition).User_Petition?.some((u) => u.user_id === userUuid && u.subscribed);

	const likedByUser =
		post.type === "Offer"
			? !!(post as IOffer).User_Offer?.some((u) => u.user_id === userUuid && u.liked)
			: !!(post as IPetition).User_Petition?.some((u) => u.user_id === userUuid && u.liked);

	const tags = (post as IOffer | IPetition).tags?.map((t) => t.Tag?.name).filter(Boolean) as string[] | undefined;

	const displayImages: string[] = post.images?.filter((img) => img && img.trim() !== "")?.length
		? post.images.filter((img) => img && img.trim() !== "")
		: ["/placeholder.png"];

	const offerCompletionPercentage = parseFloat(((currentProgress * 100) / (post?.target_progress ?? 1)).toFixed(2));

	const postUrl = `${BASE_DOMAIN}${post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}`;

	const businessName = post?.businesses?.[0]?.business.name || "Negocio";
	const businessImage = post?.businesses?.[0]?.business.profile_picture || "/placeholder.png";

	return (
		<article
			className={cn(
				"group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
				className
			)}
		>
			<div className="relative w-full bg-muted">
				<div className="absolute left-3 top-3 z-10">
					<LikeButton
						likes={post.likes}
						likedByUser={likedByUser}
						post_id={post.id}
						typeOfPost={post.type === "Petition" ? "Petición" : "Oferta"}
						user_id={userUuid}
						variant="icon"
					/>
				</div>

				<Carousel className="w-full bg-secondary">
					<CarouselContent>
						{displayImages.map((image, index) => (
							<CarouselItem key={index}>
								<div
									className="relative aspect-square w-full cursor-pointer overflow-hidden"
									onClick={() => {
										setStartIndex(index);
										setIsDialogOpen(true);
									}}
								>
									<Image
										src={image}
										alt={`${post.title} - imagen ${index + 1}`}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover rounded-[20px]"
										unoptimized
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>

					{displayImages.length > 1 && (
						<>
							<CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
							<CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
						</>
					)}
				</Carousel>
			</div>

			<div className="p-5 space-y-4">
				<div className="flex items-start justify-between">
					<Link
						href={post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}
						className="flex-1"
					>
						<h3 className="text-xl font-bold hover:underline">{post.title}</h3>
						<p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.text}</p>
					</Link>
				</div>

				<div className="space-y-2">
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<div className="flex items-center gap-1.5">
							{post.type === "Offer" ? (
								<>
									<Timer className="h-4 w-4 text-primary" />
									<span className="text-sm text-primary">
										{GetTimeRemaining(post.target_completition_date)}
									</span>
								</>
							) : (
								<div />
							)}
						</div>
						<div className="flex items-center gap-1.5">
							<Users className="h-5 w-5 text-primary" />
							<span className="text-base font-bold text-primary">
								{currentProgress}{" "}
								{post.target_progress > 0 ? `de ${post.target_progress}` : "suscritos"}
							</span>
						</div>
					</div>
					<Progress value={post.target_progress === 0 ? 100 : offerCompletionPercentage} />
				</div>

				<div className="flex items-center justify-between pt-2">
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 border border-border">
							<AvatarImage src={post.User?.profile_picture || businessImage} />
							<AvatarFallback>{businessName[0]}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="text-[10px] text-muted-foreground uppercase tracking-wider">Creador</span>
							<Link
								href={`/profile/${post?.User?.id}`}
								className="text-xs font-medium hover:underline cursor-pointer"
							>
								@{post?.User?.username}
							</Link>
						</div>
					</div>

					<SubscribeButton
						post_id={post.id}
						typeOfPost={post.type === "Petition" ? "Petición" : "Oferta"}
						subscribers={currentProgress}
						subscribedByUser={subscribedByUser}
						user_id={userUuid}
						onSubscriptionChange={setCurrentProgress}
						variant="switch"
					/>
				</div>
			</div>

			<PopOutMedia
				images={displayImages}
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				startIndex={startIndex}
			/>
		</article>
	);
}

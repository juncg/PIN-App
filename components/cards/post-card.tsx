"use client";

import { useUser } from "@/hooks/use-user";
import { BASE_DOMAIN, POST_ON_FIRE_COMPLETION_PERCENTAGE } from "@/lib/constants";
import { IOffer, IPetition } from "@/lib/services/types";
import { GetTimeRemaining } from "@/lib/services/utilities";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { PopOutMedia } from "../floating-panels/pop-out-media";
import { ClockIcon, PeopleAltIcon, Shining2LineIcon } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";
import { Button } from "../ui-custom/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui-custom/carousel";
import { Progress } from "../ui-custom/progress";
import { B1, B3, H4, S1 } from "../ui-custom/typography";

export interface IPostCard {
	className?: string;
	post: IOffer | IPetition;
	images?: string[];
	likedByUser?: boolean;
	onLikeChangeForParent?: (liked: boolean) => void;
	subscribedByUser?: boolean;
	onSubscribeChangeForParent?: (subscribed: boolean) => void;
	userUuidProp?: string | null;
}

// i think memoizing this will help performance cause it prevents unnecessary re-renders
export const PostCard = React.memo(function PostCard(props: IPostCard) {
	const {
		post,
		className,
		images,
		likedByUser: likedByUserProp,
		onLikeChangeForParent,
		subscribedByUser: subscribedByUserProp,
		onSubscribeChangeForParent,
		userUuidProp,
	} = props;
	const { userUuid: userUuidFromHook } = useUser();
	const userUuid = userUuidProp || userUuidFromHook;
	const [currentProgress, setCurrentProgress] = useState(post.current_progress);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [startIndex, setStartIndex] = useState(0);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	useEffect(() => {
		setCurrentProgress(post.current_progress);
	}, [post.current_progress]);

	const derivedSubscribedByUser =
		post.type === "Offer"
			? !!(post as IOffer).User_Offer?.some((u) => u.user_id === userUuid && u.subscribed)
			: !!(post as IPetition).User_Petition?.some((u) => u.user_id === userUuid && u.subscribed);

	const derivedLikedByUser =
		post.type === "Offer"
			? !!(post as IOffer).User_Offer?.some((u) => u.user_id === userUuid && u.liked)
			: !!(post as IPetition).User_Petition?.some((u) => u.user_id === userUuid && u.liked);

	const subscribedByUser = subscribedByUserProp !== undefined ? subscribedByUserProp : derivedSubscribedByUser;
	const likedByUser = likedByUserProp !== undefined ? likedByUserProp : derivedLikedByUser;

	const tags = (post as IOffer | IPetition).tags?.map((t) => t.Tag?.name).filter(Boolean) as string[] | undefined;

	const displayImages: string[] = post.images?.filter((img) => img && img.trim() !== "")?.length
		? post.images.filter((img) => img && img.trim() !== "")
		: ["/placeholder.png"];

	const offerCompletionPercentage = parseFloat(((currentProgress * 100) / (post?.target_progress ?? 1)).toFixed(2));

	const postUrl = `${BASE_DOMAIN}${post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}`;

	const businessName = post?.businesses?.[0]?.business.name || "Negocio";
	const businessImage = post?.businesses?.[0]?.business.profile_picture || "/placeholder.png";

	return (
		<article className={cn("group relative z-0 rounded-2xl text-white transition-all", className)}>
			<div className="relative h-full w-full overflow-hidden rounded-2xl p-[2px]">
				{offerCompletionPercentage >= POST_ON_FIRE_COMPLETION_PERCENTAGE ? (
					<div className="absolute inset-0 rounded-2xl bg-[linear-gradient(90deg,var(--chernobyl)_0%,var(--lightgrey)_20%,var(--chernobyl)_40%,var(--darkgrey)_60%,var(--white)_80%,var(--chernobyl)_100%)] bg-[length:600%_600%] animate-border-spin -z-10" />
				) : (
					<div className="absolute inset-0 rounded-2xl bg-cardborder -z-10" />
				)}
				<div className="h-full w-full rounded-2xl bg-darkmode">
					<div className="relative w-full">
						<div className="absolute left-3 top-3 z-10">
							<LikeButton
								likes={post.likes}
								likedByUser={likedByUser}
								post_id={post.id}
								typeOfPost={post.type === "Petition" ? "Petición" : "Oferta"}
								user_id={userUuid}
								variant="icon"
								onLikeChangeForParent={onLikeChangeForParent}
							/>
						</div>

						<div className="absolute right-3 top-3 z-10">
							<Button
								className="h-8 w-8 rounded-full p-0 bg-white text-darkmode transition hover:text-destructive"
								size="icon"
							>
								<Shining2LineIcon className="text-black !w-5 !h-5" />
							</Button>
						</div>

						<Carousel
							className="w-full"
							onSlideChange={(idx: number) => setCurrentIndex(idx)}
							setApi={(api) => {
								if (!api) return;
								setCanScrollPrev(api.canScrollPrev());
								setCanScrollNext(api.canScrollNext());
								api.on("select", () => {
									setCanScrollPrev(api.canScrollPrev());
									setCanScrollNext(api.canScrollNext());
								});
							}}
						>
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
												className="object-cover rounded-2xl border-[3px] border-darkmode"
												unoptimized
											/>
										</div>
									</CarouselItem>
								))}
							</CarouselContent>

							{displayImages.length > 1 && (
								<>
									{canScrollPrev && (
										<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 text-placeholder hover:text-darkmode opacity-0 group-hover:opacity-100 transition-all" />
									)}
									{canScrollNext && (
										<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-placeholder hover:text-darkmode opacity-0 group-hover:opacity-100 transition-all" />
									)}
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
								<H4 className="hover:underline">{post.title}</H4>
								<B3 className="mt-1 line-clamp-2">{post.text}</B3>
							</Link>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div>
									{post.type === "Offer" && (
										<div className="flex items-center gap-1.5">
											<ClockIcon className="!h-4 !w-4" />
											<B1>{GetTimeRemaining(post.target_completition_date)}</B1>
										</div>
									)}
								</div>

								<div className="flex items-center gap-1.5">
									<S1>
										{currentProgress}{" "}
										{post.target_progress > 0 ? `de ${post.target_progress}` : "suscritos"}
									</S1>

									<PeopleAltIcon className="!h-5 !w-5" />
								</div>
							</div>

							<Progress value={post.target_progress === 0 ? 100 : offerCompletionPercentage} />
						</div>

						<div className="flex items-center justify-between pt-2">
							<div className="flex items-center gap-2">
								<Avatar className="h-8 w-8 rounded-full hover">
									<AvatarImage src={post.User?.profile_picture || businessImage} />
									<AvatarFallback>{businessName[0]}</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-[10px] text-lightgrey uppercase tracking-wider">Creador</span>
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
								onSubscribeChangeForParent={onSubscribeChangeForParent}
							/>
						</div>
					</div>
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
});

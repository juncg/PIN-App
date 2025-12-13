"use client";

import { useUser } from "@/hooks/use-user";
import { BASE_DOMAIN, POST_ON_FIRE_COMPLETION_PERCENTAGE } from "@/lib/constants";
import { IOffer, IPetition } from "@/lib/services/types";
import { GetTimeRemaining } from "@/lib/services/utilities";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { HyperLikeButton } from "../buttons/hyper-like";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { CardImagesCarousel } from "../carousel/card-images-carousel";
import { ClockIcon, PeopleAltIcon } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";
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

	const hasValidImages = (post.images ?? []).filter((img) => img && img.trim() !== "").length > 0;
	const displayImages: string[] = hasValidImages ? (post.images ?? []).filter((img) => img && img.trim() !== "") : [];

	const offerCompletionPercentage = parseFloat(((currentProgress * 100) / (post?.target_progress ?? 1)).toFixed(2));

	const postUrl = `${BASE_DOMAIN}${post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}`;

	const businessName = post?.businesses?.[0]?.business.name || "Negocio";
	const businessImage = post?.businesses?.[0]?.business.profile_picture || "/placeholder.png";

	return (
		<article className={cn("group relative z-0 rounded-2xl flex justify-between transition-all", className)}>
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
								typeOfPost={post.type}
								user_id={userUuid}
								variant="icon"
								onLikeChangeForParent={onLikeChangeForParent}
								postCreatorId={post.creator_id as string}
							/>
						</div>

						<div className="absolute right-3 top-3 z-10">
							<HyperLikeButton />
						</div>

						<CardImagesCarousel post={post} displayImages={displayImages} />
					</div>

					<div className="p-5 space-y-4">
						<div className="flex items-start justify-between">
							<Link
								href={post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}
								className="flex-1 min-w-0"
							>
								<div
									className={cn(
										"min-h-[4rem] max-h-[4rem] flex items-start overflow-hidden",
										displayImages.length === 0 && "mt-10"
									)}
								>
									<H4 className="hover:underline line-clamp-2 overflow-hidden">{post.title}</H4>
								</div>
								<div className="min-h-[3rem] flex items-start mt-1">
									{post.text && post.text.trim().length > 0 ? (
										<B3 className="line-clamp-2 overflow-hidden">{post.text}</B3>
									) : (
										<B3 className="italic line-clamp-2 overflow-hidden">
											*El creador de esta publicación no ha añadida una descripción.*
										</B3>
									)}
								</div>
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
										className="text-xs font-medium hover:underline cursor-pointer max-w-[5rem] line-clamp-1 overflow-hidden text-ellipsis"
									>
										@{post?.User?.username}
									</Link>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<SubscribeButton
									post_id={post.id}
									typeOfPost={post.type}
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
			</div>
		</article>
	);
});

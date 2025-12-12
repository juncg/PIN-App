"use client";

import { useUser } from "@/hooks/use-user";
import { IOffer, IPetition } from "@/lib/services/types";
import { GetTimeRemaining } from "@/lib/services/utilities";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { CardImagesCarousel } from "../carousel/card-images-carousel";
import { ClockIcon, FrontHandIcon, LocalOfferIcon, PeopleAltIcon, Shining2LineIcon } from "../icons/icons";
import { ShareComponent } from "../share-post/share";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";
import { Button } from "../ui-custom/button";
import { Progress } from "../ui-custom/progress";
import { B1, H3, S1 } from "../ui-custom/typography";

export interface IFeedPostCard {
	className?: string;
	post: IOffer | IPetition;
	images?: string[];
	likedByUser?: boolean;
	onLikeChangeForParent?: (liked: boolean) => void;
	subscribedByUser?: boolean;
	onSubscribeChangeForParent?: (subscribed: boolean) => void;
	userUuidProp?: string | null;
}

export function FeedPostCard(props: IFeedPostCard) {
	const {
		post,
		className,
		likedByUser: likedByUserProp,
		onLikeChangeForParent,
		subscribedByUser: subscribedByUserProp,
		onSubscribeChangeForParent,
		userUuidProp,
	} = props;

	const { userUuid: userUuidFromHook } = useUser();
	const userUuid = userUuidProp || userUuidFromHook;
	const [currentProgress, setCurrentProgress] = useState(post.current_progress);

	const commentCount = post.comment_count;

	useEffect(() => {
		setCurrentProgress(post.current_progress);
	}, [post.current_progress]);

	const originalPrice = post.products?.reduce((total, product) => total + (product.Product.msrp || 0), 0) || 0;
	const discountPercentage = originalPrice > 0 ? Math.round(100 - (post.reduced_price! * 100) / originalPrice) : 0;

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

	const offerCompletionPercentage = parseFloat(((currentProgress * 100) / (post?.target_progress ?? 1)).toFixed(2));
	const hasFinished = post.type === "Offer" ? new Date(post.target_completition_date) <= new Date() : false;

	const hasValidImages = (post.images ?? []).filter((img) => img && img.trim() !== "").length > 0;
	const displayImages: string[] = hasValidImages ? (post.images ?? []).filter((img) => img && img.trim() !== "") : [];

	const showSideBySide = displayImages.length === 2;

	return (
		<article className={cn("w-full bg-darkmode rounded-3xl border-[2px] border-cardborder p-6", className)}>
			<div className="flex justify-between items-start mb-4">
				<div className="flex gap-3 items-center">
					<Avatar className="h-10 w-10 rounded-full">
						<AvatarImage src={post.User?.profile_picture || "/placeholder.png"} />
						<AvatarFallback className="object-cover rounded-full">
							{post.User?.username?.[0] || "U"}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="text-[10px] text-lightgrey uppercase tracking-wider font-semibold">
							Creador
						</span>
						<Link
							href={`/profile/${post?.User?.id}`}
							className="hover:underline flex items-center gap-1 group"
						>
							<span className="text-white font-bold text-sm">@{post.User?.username}</span>
						</Link>
					</div>
				</div>

				<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cardborder/50 border border-cardborder text-xs font-medium text-white">
					{post.type === "Offer" ? "Oferta" : "Petición"}
					{post.type === "Offer" ? (
						<LocalOfferIcon className="w-4 h-4 text-white" />
					) : (
						<FrontHandIcon className="w-4 h-4 text-white" />
					)}
				</div>
			</div>

			<div className="mb-6">
				<div className="flex justify-between items-start">
					<Link
						href={post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}
						className="group"
					>
						<H3 className="text-xl font-bold text-white mb-2 group-hover:underline decoration-white/50 underline-offset-4">
							{post.title}.
						</H3>
					</Link>

					{post.type === "Offer" && post.reduced_price && (
						<div className="text-right">
							<span className="text-xl font-bold text-white block">{post.reduced_price}€</span>
							{originalPrice != post.reduced_price && originalPrice > 0 && (
								<div className="text-xs flex items-center gap-1 justify-end">
									<span className="text-chernobyl font-bold">-{discountPercentage}%</span>
									<span className="text-lightgrey line-through">{originalPrice}€</span>
								</div>
							)}
						</div>
					)}
				</div>

				<B1 className="text-lightgrey mb-4 line-clamp-2 leading-relaxed text-sm">{post.text}</B1>

				{hasValidImages && (
					<div className="w-full mt-4">
						{showSideBySide ? (
							<div className="flex gap-2 h-64 w-full">
								{displayImages.map((img, idx) => (
									<div
										key={idx}
										className="relative w-1/2 h-full rounded-2xl overflow-hidden border-2 border-cardborder group/image cursor-pointer"
									>
										<Image
											src={img}
											alt={`Image ${idx}`}
											fill
											className="object-cover transition-transform duration-500 group-hover/image:scale-110"
											unoptimized
										/>
									</div>
								))}
							</div>
						) : (
							<CardImagesCarousel post={post} displayImages={displayImages} />
						)}
					</div>
				)}
			</div>

			<div className="flex flex-col gap-3 mb-6">
				<div className="flex justify-between">
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
							{currentProgress} {post.target_progress > 0 ? `de ${post.target_progress}` : "suscritos"}
						</S1>

						<PeopleAltIcon className="!h-5 !w-5" />
					</div>
				</div>

				<Progress value={offerCompletionPercentage} className="h-1.5 bg-cardborder" />
			</div>

			<div className="flex justify-between items-center">
				<div className="flex items-center gap-6">
					<Button
						variant="outline"
						size="sm"
						className="rounded-full border-chernobyl text-white hover:bg-chernobyl/10 px-3 py-1 h-9 gap-1.5 bg-transparent border transition-all"
					>
						<Shining2LineIcon className="w-4 h-4 text-chernobyl fill-current" />
						<span className="font-bold text-xs">HyperLike</span>
					</Button>

					<div className="flex items-center gap-6 text-sm font-medium text-white">
						<div className="flex items-center gap-1.5 group cursor-pointer hover:text-destructive transition-colors">
							<LikeButton
								likes={post.likes}
								likedByUser={likedByUser}
								post_id={post.id}
								typeOfPost={post.type}
								user_id={userUuid}
								variant="default"
								onLikeChangeForParent={onLikeChangeForParent}
								postCreatorId={post.creator_id as string}
							/>
						</div>

						<div className="flex items-center gap-1.5 group cursor-pointer hover:text-primary transition-colors">
							<MessageCircle className="w-4 h-4" />
							<span>{commentCount}</span>
						</div>
						<ShareComponent
							variant="icon"
							url={`${typeof window !== "undefined" ? window.location.origin : ""}${
								post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`
							}`}
							title={post.title}
							description={post.text}
						/>
					</div>
				</div>

				<SubscribeButton
					post_id={post.id}
					typeOfPost={post.type}
					subscribers={currentProgress}
					subscribedByUser={subscribedByUser}
					user_id={userUuid}
					onSubscriptionChange={setCurrentProgress}
					variant="switch"
					onSubscribeChangeForParent={onSubscribeChangeForParent}
					offerHasFinished={hasFinished}
				/>
			</div>
		</article>
	);
}

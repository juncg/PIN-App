"use client";

import { useUser } from "@/hooks/use-user";
import { IOffer, IPetition } from "@/lib/services/types";
import { GetTimeRemaining } from "@/lib/services/utilities";
import { cn } from "@/lib/utils";
import { Hand, Tag, Verified } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { ClockIcon, PeopleAltIcon, Shining2LineIcon } from "../icons/icons";
import { Button } from "../ui-custom/button";
import { Progress } from "../ui-custom/progress";
import { B1, B5, H3, S1 } from "../ui-custom/typography";
import { HyperLikeButton } from "../buttons/hyper-like";

interface IPostCardHorizontalProps {
	className?: string;
	post: IOffer | IPetition;
	subscribedByUser?: boolean;
	onSubscribeChangeForParent?: (subscribed: boolean) => void;
	userUuidProp?: string | null;
	likedByUser?: boolean;
	onLikeChangeForParent?: (liked: boolean) => void;
}

export function PostCardHorizontal(props: IPostCardHorizontalProps) {
	const {
		className,
		post,
		subscribedByUser: subscribedByUserProp,
		onSubscribeChangeForParent,
		userUuidProp,
		likedByUser: likedByUserProp,
		onLikeChangeForParent,
	} = props;
	const { userUuid: userUuidFromHook } = useUser();
	const userUuid = userUuidProp || userUuidFromHook;

	const [currentProgress, setCurrentProgress] = useState(post.current_progress);

	useEffect(() => {
		setCurrentProgress(post.current_progress);
	}, [post.current_progress]);

	const offerCompletionPercentage = parseFloat(((currentProgress * 100) / (post?.target_progress ?? 1)).toFixed(2));

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
	const hasFinished = post.type === "Offer" ? new Date(post.target_completition_date) <= new Date() : false;

	const hasValidImages = (post.images ?? []).filter((img) => img && img.trim() !== "")?.length > 0;

	return (
		<article className={cn(className, "flex border-[2px] border-cardborder rounded-2xl w-full")}>
			{hasValidImages && (
				<figure className="relative w-60 h-60 rounded-2xl border-[3px] border-darkmode overflow-hidden shrink-0">
					<Image
						src={post?.images?.[0] || "/placeholder.png"}
						alt={"Post picture"}
						fill
						className="object-cover"
						unoptimized
					/>
				</figure>
			)}

			<div className="flex flex-col justify-between p-6 w-full min-w-0">
				<div className="flex w-full justify-between gap-8">
					<div className="flex flex-col min-w-0">
						<Link
							href={post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}
							className="hover:underline flex items-center gap-2"
						>
							{post.type === "Offer" ? (
								<Tag className="h-5 w-5 text-primary shrink-0" />
							) : (
								<Hand className="h-5 w-5 text-primary shrink-0" />
							)}
							<H3 className="line-clamp-1">{post.title}.</H3>
						</Link>

						<B1 className="text-lightgrey line-clamp-2">{post.text}</B1>
					</div>

					{post.products &&
						post.products.length > 0 &&
						post.reduced_price !== null &&
						post.reduced_price > 0 && (
							<div className="flex flex-col items-end shrink-0">
								<H3>{post.reduced_price ?? 0}€</H3>

								{originalPrice != post.reduced_price && (
									<div className="flex gap-2 items-center">
										<B5 className="text-chernobyl md:line-clamp-1">-{discountPercentage}%</B5>
										<B1 className="line-through text-lightgrey">{originalPrice}€</B1>
									</div>
								)}
							</div>
						)}
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
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
									{currentProgress}{" "}
									{post.target_progress > 0 ? `de ${post.target_progress}` : "suscritos"}
								</S1>

								<PeopleAltIcon className="!h-5 !w-5" />
							</div>
						</div>

						<Progress value={offerCompletionPercentage} />
					</div>

					<div className="flex justify-between">
						<div className="flex gap-2 items-center">
							<figure className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
								<Image
									src={post?.User?.profile_picture || "/placeholder.png"}
									alt={"Creator picture"}
									fill
									className="object-cover"
									unoptimized
								/>
							</figure>

							<span>
								<B5 className="text-lightgrey">Creador</B5>
								<Link href={`/profile/${post?.User?.id}`} className="hover:underline">
									<B1 className="flex items-center gap-2">
										@{post?.User?.username || "ejemplo"} <Verified className="h-4" />
									</B1>
								</Link>
							</span>
						</div>

						<div className="flex items-center gap-4">
							<div className="flex gap-2">
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

								<HyperLikeButton />
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
					</div>
				</div>
			</div>
		</article>
	);
}

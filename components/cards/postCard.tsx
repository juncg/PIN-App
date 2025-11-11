"use client";

import { useUser } from "@/hooks/use-user";
import { BASE_DOMAIN } from "@/lib/constants";
import { IOffer, IPetition } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { ShareComponent } from "../share-post/share";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { H3, H4, P } from "../ui/typography";

export interface IPostCard {
	className?: string;
	post: IOffer | IPetition;
	images?: string[];
}

export function PostCard({ props }: { props: IPostCard }) {
	const { post, className, images } = props;
	const { userUuid } = useUser();
	const [subscribers, setSubscribers] = useState(post.current_progress);

	const initialSubscribed =
		post.type === "Offer"
			? !!(post as IOffer).User_Offer?.some((u) => u.user_id === userUuid && u.subscribed)
			: !!(post as IPetition).User_Petition?.some((u) => u.user_id === userUuid && u.subscribed);
	const [subscribedByUser, setIsSubscribed] = useState<boolean>(initialSubscribed);

	const likedByUser =
		post.type === "Offer"
			? !!(post as IOffer).User_Offer?.some((u) => u.user_id === userUuid && u.liked)
			: !!(post as IPetition).User_Petition?.some((u) => u.user_id === userUuid && u.liked);

	const tags = (post as IOffer | IPetition).tags?.map((t) => t.name).filter(Boolean) as string[] | undefined;

	const displayImages =
		images && images.length > 0 ? images : ["/images/placeholder.jpg", "/images/placeholder.jpg", "/images/placeholder.jpg"];
	const offerCompletionPercentage = parseFloat(((subscribers * 100) / (post?.target_progress ?? 1)).toFixed(2));
	const postUrl = `${BASE_DOMAIN}${post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}`;

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex flex-col gap-2">
					<H3>{post.title}</H3>
					<H4>{post?.businesses?.[0]?.business.name}</H4>
				</div>

				<div className="flex flex-col gap-2">
					<Badge>{post.type === "Petition" ? "Petición" : "Oferta"}</Badge>
				</div>
			</div>

			<div className="flex flex-col mb-10 gap-4">
				<P>{post.text}</P>

				{displayImages.length > 0 && (
					<Carousel className="w-full mx-auto max-w-md">
						<CarouselContent>
							{displayImages.map((image, index) => (
								<CarouselItem key={index}>
									<div className="relative aspect-video w-full overflow-hidden rounded-md">
										<Image
											src={image}
											alt={`${post.title} - imagen ${index + 1}`}
											fill
											className="object-cover"
											unoptimized
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{displayImages.length > 1 && (
							<>
								<CarouselPrevious className="left-2" />
								<CarouselNext className="right-2" />
							</>
						)}
					</Carousel>
				)}
			</div>

			<div className="flex flex-col gap-8">
				<div className="flex justify-between">
					<Link href={post.type === "Petition" ? `/petitions/${post.id}` : `/offers/${post.id}`}>
						<Button variant="default">Información</Button>
					</Link>

					<SubscribeButton
						post_id={post.id}
						typeOfPost={post.type === "Petition" ? "Petición" : "Oferta"}
						subscribers={subscribers}
						subscribedByUser={subscribedByUser}
						setSubscribers={(value) => setSubscribers(value)}
						setIsSubscribed={(value) => setIsSubscribed(value)}
						user_id={userUuid}
					/>
				</div>

				{post.type === "Offer" && (
					<div className="flex flex-col gap-2">
						<Progress value={offerCompletionPercentage} />

						<div className="flex justify-between">
							<H4>
								{subscribers} / {post.target_progress}
							</H4>

							<H4>{offerCompletionPercentage}%</H4>
						</div>
					</div>
				)}
				{post.type === "Petition" && (
					<div className="flex flex-col gap-2">
						<Progress value={offerCompletionPercentage} />

						<div className="flex justify-between">
							<H4>
								{subscribers} / {post.target_progress}
							</H4>

							<H4>{offerCompletionPercentage}%</H4>
						</div>
					</div>
				)}
			</div>

			{tags && tags.length > 0 && (
				<div className="flex flex-wrap gap-2 py-2">
					{tags.map((tag, index) => (
						<Badge key={index} variant="secondary">
							{tag}
						</Badge>
					))}
				</div>
			)}

			<div className="flex">
				<Separator />
			</div>

			<div className="flex flex-row justify-between">
				<div className="flex flex-row justify-start gap-6">
					<LikeButton
						likes={post.likes}
						likedByUser={likedByUser}
						post_id={post.id}
						typeOfPost={post.type === "Petition" ? "Petición" : "Oferta"}
						user_id={userUuid}
					/>
					<ShareComponent url={postUrl} title={post.title} description={post.text} />
				</div>
			</div>
		</article>
	);
}

"use client";

import { BASE_DOMAIN } from "@/lib/constants";
import { IOffer, IPetition } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { LikeButton } from "../buttons/like-button";
import { SubscribeButton } from "../buttons/subscribe-button";
import { ShareComponent } from "../share-post/share";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { H3, H4, P } from "../ui/typography";
import { useState } from "react";

type PostType = "Oferta" | "Petición";

export interface IPostCard {
	className?: string;
	post: IOffer | IPetition;
	typeOfPost: PostType;
	userUuid: string;
	likedByUser: boolean;
	subscribedByUser: boolean;
	tags?: string[];
	images?: string[];
}

// ni pajolera idea de porque lo hace como lo hace, pero consigue lo que queria
function generateRandomPlaceholders(postId: number): string[] {
	const seed = postId;
	const count = (((seed * 9301 + 49297) % 233280) % 3) + 1;

	return Array.from({ length: count }, () => "/images/jancarlo.jpg");
}

export function PostCard({ props }: { props: IPostCard }) {
	const { post, className, userUuid, typeOfPost, likedByUser, tags, images } = props;
	const [subscribers, setSubscribers] = useState(post.current_progress);
	const [subscribedByUser, setIsSubscribed] = useState(props.subscribedByUser);

	const displayImages = images && images.length > 0 ? images : generateRandomPlaceholders(post.id);
	const offerCompletionPercentage = parseFloat(((subscribers * 100) / (post?.target_progress ?? 1)).toFixed(2));
	const postUrl = `${BASE_DOMAIN}${typeOfPost === "Petición" ? `/petitions/${post.id}` : `/offers/${post.id}`}`;

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex flex-col gap-2">
					<H3>{post.title}</H3>
					{/*<H4>{post.business.name}</H4>*/}
				</div>

				<div className="flex flex-col gap-2">
					<Badge>{typeOfPost}</Badge>
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
					<Link href={typeOfPost === "Petición" ? `/petitions/${post.id}` : `/offers/${post.id}`}>
						<Button variant="default">Información</Button>
					</Link>

					{userUuid ? (
						<SubscribeButton
							post_id={post.id}
							typeOfPost={typeOfPost}
							subscribers={subscribers}
							subscribedByUser={subscribedByUser}
							setSubscribers={(value) => setSubscribers(value)}
							setIsSubscribed={(value) => setIsSubscribed(value)}
						/>
					) : (
						<Link href={"/auth/login"}>
							<Button>Suscribirme</Button>
						</Link>
					)}
				</div>

				{typeOfPost === "Oferta" && (
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
				{typeOfPost === "Petición" && (
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
						typeOfPost={typeOfPost}
					/>
					<ShareComponent url={postUrl} title={post.title} description={post.text} />
				</div>
			</div>
		</article>
	);
}

"use client";

import { SubscribeButton } from "@/components/buttons/subscribe-button";
import { LikeButton } from "@/components/buttons/like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Progress } from "@/components/ui-custom/progress";
import { IComment, IPetition, IProduct, IUser } from "@/lib/services/types";
import { Users, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentsSection } from "../comments/comments-section";
import { ProductImages } from "../products/product-images";
import { AltenatingButtons, SlidingButtonProps } from "@/components/buttons/sliding-buttons";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui-custom/carousel";
import { S1, B1 } from "@/components/ui-custom/typography";
import Link from "next/link";
import { ShareComponent } from "../share-post/share";
import { ProductCard } from "../cards/product-card";

interface PetitionDetailsProps {
	petition: IPetition;
	subscribedByUser: boolean;
	likedByUser: boolean;
	currentUser: IUser | null;
	comments?: IComment[];
	businessProducts?: IProduct[];
}

export function PetitionDetails({
	petition,
	subscribedByUser,
	likedByUser,
	currentUser,
	comments,
	businessProducts,
}: PetitionDetailsProps) {
	const [currentProgress, setCurrentProgress] = useState(petition.current_progress);
	const [isSubscribed, setIsSubscribed] = useState(subscribedByUser);
	const [isLiked, setIsLiked] = useState(likedByUser);
	const [likes, setLikes] = useState(petition.likes ?? 0);

	// Safe check for products
	const hasProducts = petition.products && petition.products.length > 0;

	const originalPrice = hasProducts
		? petition.products?.reduce((total, product) => total + (product.Product?.msrp || 0), 0) || 0
		: 0;

	const discountPercentage =
		originalPrice > 0 && petition.reduced_price
			? Math.round(100 - (petition.reduced_price * 100) / originalPrice)
			: 0;

	useEffect(() => {
		setCurrentProgress(petition.current_progress);
		setIsSubscribed(subscribedByUser);
	}, [petition.current_progress, subscribedByUser]);

	const petitionCompletionPercentage = parseFloat(
		((currentProgress * 100) / (petition?.target_progress ?? 1)).toFixed(2)
	);

	const handleSubscriptionChange = (newProgress: number) => {
		setCurrentProgress(newProgress);
		setIsSubscribed(!isSubscribed);
	};

	const displayImages: string[] = petition.images?.filter((img) => img && img.trim() !== "")?.length
		? petition.images.filter((img) => img && img.trim() !== "")
		: ["/placeholder.png"];

	const loremIpsumDesc =
		"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero totam ratione accusamus sunt iusto ad animi, quia incidunt cum, explicabo alias molestias itaque, nesciunt beatae dolorem autem harum sapiente laboriosam.";
	const slidingButtonsContent: SlidingButtonProps[] = [
		{
			content: <div>{loremIpsumDesc}</div>,
			displayName: "Descripción",
			displayIcon: null,
		},
		{
			content: <div>{loremIpsumDesc}</div>,
			displayName: "Detalles",
			displayIcon: null,
		},
		{
			content: <div>{loremIpsumDesc}</div>,
			displayName: "Especificaciones",
			displayIcon: null,
		},
	];

	let businessLink = "";
	if (petition.businesses && petition.businesses.length > 0) {
		businessLink = `/business/${petition.businesses[0].business.id}`;
	} else if (hasProducts) {
		const productBusinessId = petition.products?.[0]?.Product?.businesses?.[0]?.business?.id;
		if (productBusinessId) {
			businessLink = `/business/${productBusinessId}`;
		}
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid lg:grid-cols-2 gap-8 mb-12">
				<div className="space-y-4">
					<ProductImages images={displayImages} />
					<div className="flex flex-grid flex-center">
						<LikeButton
							likes={likes}
							likedByUser={isLiked}
							post_id={petition.id}
							typeOfPost="Petition"
							user_id={currentUser?.id || null}
							variant="withtext"
							onLikeChangeForParent={(liked) => {
								setIsLiked(liked);
								setLikes(liked ? likes + 1 : likes - 1);
							}}
							postCreatorId={petition.User?.id}
						/>
						<ShareComponent
							url={typeof window !== "undefined" ? window.location.href.split("?")[0] : ""}
							title={petition.title}
							description={petition.text}
							variant="withtext"
						/>
					</div>
				</div>{" "}
				<div className="space-y-6">
					<h1 className="text-4xl font-black mb-4">{petition.title}</h1>

					{hasProducts && petition.reduced_price !== null && (
						<div className="space-y-1">
							<div className="flex items-baseline gap-3">
								<span className="text-lg font-black" style={{ color: "#C4FF33" }}>
									-{discountPercentage}%
								</span>
								<span className="text-3xl font-black">{petition.reduced_price}€</span>
							</div>
							<div className="text-sm text-lightgrey">Precio original: {originalPrice}€</div>
						</div>
					)}

					<div>
						<B1 className="text-lightgrey whitespace-pre-wrap break-words">{petition.text}</B1>
					</div>

					{businessLink && (
						<div className="flex items-start gap-1.5 text-md">
							<Link href={businessLink} className="hover:underline">
								<span className="text-lightgrey">Ver en la web de la empresa</span>
							</Link>
							<ArrowUpRight className="h-4 w-4" />
						</div>
					)}

					<div className="space-y-2">
						<div className="flex items-end justify-end">
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-bold text-white">
									{currentProgress} de {petition.target_progress}
								</span>
								<Users className="!h-5 !w-5" />
							</div>
						</div>

						<Progress value={petitionCompletionPercentage} />
					</div>

					<div className="flex items-center justify-between pt-2">
						<div className="flex items-center gap-2">
							<Avatar className="h-8 w-8 rounded-full">
								<AvatarImage src={petition.User?.profile_picture || undefined} />
								<AvatarFallback>
									{petition.User?.username?.charAt(0).toLocaleUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="text-[10px] text-lightgrey uppercase tracking-wider">Creador</span>
								<a
									href={`/profile/${petition.User?.id}`}
									className="text-xs font-medium hover:underline cursor-pointer"
								>
									@{petition.User?.username}
								</a>
							</div>
						</div>

						<SubscribeButton
							post_id={petition.id}
							typeOfPost="Petition"
							subscribers={currentProgress}
							subscribedByUser={isSubscribed}
							user_id={currentUser?.id || null}
							onSubscriptionChange={handleSubscriptionChange}
							variant="switch"
						/>
					</div>
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-8">
				<div>
					<AltenatingButtons buttonsContent={slidingButtonsContent} textSize="text-xl" />
				</div>
				<div></div>
			</div>

			<CommentsSection
				postType="Petition"
				postId={petition.id}
				currentUser={currentUser}
				comments={comments}
				postCreatorId={petition.creator_id || ""}
			/>

			<div className="py-8">
				{hasProducts && businessProducts && businessProducts.length > 0 ? (
					<div>
						<div className="mb-6">
							<S1>Más productos de la empresa.</S1>
						</div>

						<Carousel
							opts={{
								align: "start",
								loop: true,
							}}
							className="w-full"
						>
							<CarouselContent className="-ml-2 md:-ml-3">
								{businessProducts.map((product) => (
									<CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
										<ProductCard props={{ product }} />
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious className="left-0" />
							<CarouselNext className="right-0" />
						</Carousel>
					</div>
				) : hasProducts ? (
					<B1 className="text-lightgrey">No hay más productos de esta empresa.</B1>
				) : null}
			</div>
		</div>
	);
}

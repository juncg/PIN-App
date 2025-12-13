"use client";

import { SubscribeButton } from "@/components/buttons/subscribe-button";
import { LikeButton } from "@/components/buttons/like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Progress } from "@/components/ui-custom/progress";
import { IComment, IOffer, IProduct, IUser } from "@/lib/services/types";
import { GetTimeRemaining } from "@/lib/services/utilities";
import { Users, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentsSection } from "../comments/comments-section";
import { ProductImages } from "../products/product-images";
import { AltenatingButtons, SlidingButtonProps } from "@/components/buttons/sliding-buttons";
import { ClockIcon } from "../icons/icons";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui-custom/carousel";
import { S1, B1 } from "@/components/ui-custom/typography";
import Link from "next/link";
import { Checkbox } from "../ui-custom/checkbox";
import { Card, CardContent } from "../ui-custom/card";
import { ShareComponent } from "../share-post/share";
import { ProductCard } from "../cards/product-card";
import { OfferWarning } from "./offer-warning";
import { VerifiedIcon } from "@/components/icons/icons";

interface OfferDetailsProps {
	offer: IOffer;
	subscribedByUser: boolean;
	likedByUser: boolean;
	currentUser: IUser | null;
	comments?: IComment[];
	businessProducts: IProduct[];
}

export function OfferDetails({
	offer,
	subscribedByUser,
	likedByUser,
	currentUser,
	comments,
	businessProducts,
}: OfferDetailsProps) {
	const [currentProgress, setCurrentProgress] = useState(offer.current_progress);
	const [isSubscribed, setIsSubscribed] = useState(subscribedByUser);
	const [isLiked, setIsLiked] = useState(likedByUser);
	const [likes, setLikes] = useState(offer.likes);
	const [acceptedConditions, setAcceptedConditions] = useState(false);

	const originalPrice = offer.products?.reduce((total, product) => total + (product.Product?.msrp || 0), 0) || 0;
	const discountPercentage = originalPrice > 0 ? Math.round(100 - (offer.reduced_price! * 100) / originalPrice) : 0;

	useEffect(() => {
		setCurrentProgress(offer.current_progress);
		setIsSubscribed(subscribedByUser);
	}, [offer.current_progress, subscribedByUser]);

	const offerCompletionPercentage = parseFloat(((currentProgress * 100) / (offer?.target_progress ?? 1)).toFixed(2));

	const handleSubscriptionChange = (newProgress: number) => {
		setCurrentProgress(newProgress);
		setIsSubscribed(!isSubscribed);
	};

	const displayImages: string[] = offer.images?.filter((img) => img && img.trim() !== "")?.length
		? offer.images.filter((img) => img && img.trim() !== "")
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
	if (offer.products && offer.products.length > 0) {
		const firstProduct = offer.products[0];
		if (firstProduct?.Product?.businesses && firstProduct.Product.businesses.length > 0) {
			const businessId = firstProduct.Product.businesses[0].business.id;
			businessLink = `/business/${businessId}`;
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
							post_id={offer.id}
							typeOfPost="Offer"
							user_id={currentUser?.id || null}
							variant="withtext"
							onLikeChangeForParent={(liked) => {
								setIsLiked(liked);
								setLikes(liked ? likes + 1 : likes - 1);
							}}
							postCreatorId={offer.creator_id || ""}
						/>
						<ShareComponent
							url={typeof window !== "undefined" ? window.location.href.split("?")[0] : ""}
							title={offer.title}
							description={offer.text}
							variant="withtext"
						/>
					</div>
				</div>{" "}
				<div className="space-y-3">
					<h1 className="text-4xl font-black mb-4">{offer.title}</h1>

					{offer.products && offer.products.length > 0 && offer.products[0]?.Product?.businesses && (
						<div className="flex items-center gap-1.5">
							<Link href={businessLink || "#"} className="hover:underline">
								<span className="text-lightgrey">
									{offer.products[0].Product.businesses[0]?.business?.name?.toLocaleUpperCase() ||
										"Empresa sin nombre"}
								</span>
							</Link>
							{offer.products[0].Product.businesses[0]?.business?.verification !== "Unverified" && (
								<VerifiedIcon className="h-4 w-4 text-chernobyl" />
							)}
						</div>
					)}

					<div className="space-y-1">
						<div className="flex items-baseline gap-3">
							{originalPrice != offer.reduced_price && originalPrice > 0 && (
								<span className="text-lg font-black" style={{ color: "#C4FF33" }}>
									-{discountPercentage}%
								</span>
							)}
							<span className="text-3xl font-black">{offer.reduced_price}€</span>
						</div>
						{originalPrice != offer.reduced_price && originalPrice > 0 && (
							<div className="text-sm text-lightgrey">Precio original: {originalPrice}€</div>
						)}
					</div>

					<div>
						<B1 className="text-lightgrey whitespace-pre-wrap break-words">{offer.text}</B1>
					</div>

					<div className="flex items-start gap-1.5 text-md">
						<Link href={`/business/${offer.businesses?.[0].business.id}`} className="hover:underline">
							<span className="text-lightgrey">Ver en la web de la empresa</span>
						</Link>
						<ArrowUpRight className="h-4 w-4" />
					</div>

					<OfferWarning
						fee={offer.fee}
						acceptedConditions={acceptedConditions}
						setAcceptedConditions={setAcceptedConditions}
					/>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-1.5">
								<ClockIcon className="!h-4 !w-4" />
								<span className="text-sm font-bold text-white">
									{GetTimeRemaining(offer.target_completition_date)}
								</span>
							</div>

							<div className="flex items-center gap-1.5">
								<span className="text-xs font-bold text-white">
									{currentProgress} de {offer.target_progress}
								</span>
								<Users className="!h-5 !w-5" />
							</div>
						</div>

						<Progress value={offerCompletionPercentage} />
					</div>

					<div className="flex items-center justify-between pt-2">
						<div className="flex items-center gap-2">
							<Avatar className="h-8 w-8 rounded-full">
								<AvatarImage src={offer.User?.profile_picture || undefined} />
								<AvatarFallback>{offer.User?.username?.charAt(0).toLocaleUpperCase()}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="text-[10px] text-lightgrey uppercase tracking-wider">Creador</span>
								<a
									href={`/profile/${offer.User?.id}`}
									className="text-xs font-medium hover:underline cursor-pointer"
								>
									@{offer.User?.username}
								</a>
							</div>
						</div>

						<SubscribeButton
							post_id={offer.id}
							typeOfPost="Offer"
							subscribers={currentProgress}
							subscribedByUser={isSubscribed}
							user_id={currentUser?.id || null}
							onSubscriptionChange={handleSubscriptionChange}
							variant="switch"
							disabled={!acceptedConditions && !isSubscribed}
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
				postType="Offer"
				postId={offer.id}
				currentUser={currentUser}
				comments={comments}
				postCreatorId={offer.creator_id || ""}
			/>

			<div className="py-8">
				{businessProducts && businessProducts.length > 0 ? (
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
				) : (
					<B1 className="text-lightgrey">No hay más productos de esta empresa.</B1>
				)}
			</div>
		</div>
	);
}

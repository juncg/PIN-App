"use client";

import { SubscribeButton } from "@/components/buttons/subscribe-button";
import { LikeButton } from "@/components/buttons/like-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Progress } from "@/components/ui-custom/progress";
import { Separator } from "@/components/ui-custom/separator";
import { IComment, IOffer, IUser } from "@/lib/services/types";
import { GetRelativeTime, GetTimeRemaining } from "@/lib/services/utilities";
import { MessageCircle, Users, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { CommentsSection } from "../comments/comments-section";
import { ProductImages } from "../products/product-images";
import { AltenatingButtons, SlidingButtonProps } from "@/components/buttons/sliding-buttons";
import { ClockIcon } from "../icons/icons";
import { PostCard } from "@/components/cards/post-card";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui-custom/carousel";
import { S1, B1 } from "@/components/ui-custom/typography";

interface OfferDetailsProps {
	offer: IOffer;
	subscribedByUser: boolean;
	likedByUser: boolean;
	currentUser: IUser | null;
	comments?: IComment[];
	businessOffers?: IOffer[];
}

export function OfferDetails({ offer, subscribedByUser, likedByUser, currentUser, comments, businessOffers }: OfferDetailsProps) {
	const [currentProgress, setCurrentProgress] = useState(offer.current_progress);
	const [isSubscribed, setIsSubscribed] = useState(subscribedByUser);
	const [isLiked, setIsLiked] = useState(likedByUser);
	const [likes, setLikes] = useState(offer.likes);
	const [acceptedConditions, setAcceptedConditions] = useState(false);
	const [randomStars] = useState(() => Math.floor(Math.random() * 5) + 1);
	const [randomReviews] = useState(() => Math.floor(Math.random() * 100) + 1);
	const [randomDiscount] = useState(() => Math.floor(Math.random() * 41) + 10);
	const [originalPrice] = useState(() => (Math.random() * 99 + 1).toFixed(2));
	const [discountedPrice] = useState(() => (parseFloat(originalPrice) * (1 - randomDiscount / 100)).toFixed(2));
	const anticipatedCharge = (parseFloat(discountedPrice) * 0.02).toFixed(2);

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

	const slidingButtonsContent: SlidingButtonProps[] = [
		{
			content: <div className="p-6"></div>,
			displayName: "Descripción",
			displayIcon: null,
		},
		{
			content: <div className="p-6"></div>,
			displayName: "Detalles",
			displayIcon: null,
		},
		{
			content: <div className="p-6"></div>,
			displayName: "Especificaciones",
			displayIcon: null,
		},
	];

	return (
		<div className="container mx-auto px-4 py-8">
		<div className="grid lg:grid-cols-2 gap-8 mb-12">
			<div className="space-y-4">
				<ProductImages images={displayImages} />
				<LikeButton
					likes={likes}
					likedByUser={isLiked}
					post_id={offer.id}
					typeOfPost="Oferta"
					user_id={currentUser?.id || null}
					variant="default"
					onLikeChangeForParent={(liked) => {
						setIsLiked(liked);
						setLikes(liked ? likes + 1 : likes - 1);
					}}
				/>
			</div>				<div className="space-y-6">
					<div className="flex flex-wrap gap-2 mb-3">
						{offer.tags && offer.tags.length > 0 ? (
							offer.tags.map((tagItem, index) => (
								<span
									key={index}
									className="bg-black text-black text-xs font-black px-3 py-1 rounded-full"
								>
									{tagItem.Tag.name?.toUpperCase()}
								</span>
							))
						) : (
							<span className="bg-black text-black text-xs font-black px-3 py-1 rounded-full">
								SIN ETIQUETAS
							</span>
						)}
					</div>
					<h1 className="text-4xl font-black mb-4">{offer.title}</h1>

				{/* Valoración con estrellas */}
				<div className="flex items-center gap-2">
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							className={`h-5 w-5 ${
								i < randomStars ? "fill-white text-white" : "text-zinc-700"
							}`}
						/>
					))}
					<span className="text-sm text-lightgrey ml-1">
						({randomReviews} Reviews)
					</span>
				</div>

				{/* Precio con descuento */}
				<div className="space-y-1">
					<div className="flex items-center gap-3">
						<span className="text-lg font-black" style={{ color: '#C4FF33' }}>
							-{randomDiscount}%
						</span>
						<span className="text-3xl font-black">{discountedPrice}€</span>
					</div>
					<div className="text-sm text-lightgrey">
						Precio original: <span className="line-through">{originalPrice}€</span>
					</div>
				</div>

				{/* Descripción */}
				{offer.text && (
					<div className="text-base">
						<p className="whitespace-pre-wrap">{offer.text}</p>
					</div>
				)}

				{/* Link al perfil del creador */}
				{offer.User?.id && (
					<a 
						href={`/profile/${offer.User.id}`}
						className="text-base font-bold text-white underline hover:opacity-80 transition-all mt-4 inline-block"
						style={{ 
							transition: 'color 0.3s ease',
						}}
						onMouseEnter={(e) => e.currentTarget.style.color = '#C4FF33'}
						onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
					>
						Ver en la web de la empresa
					</a>
				)}

			<div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-sm text-muted-foreground">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm text-lightgrey mb-3">
                    Al inscribirte en la oferta se realizará un <span className="font-bold text-white">cargo anticipado de {anticipatedCharge}€</span> como garantía de participación.
                  </p>
                  <ul className="text-sm text-lightgrey space-y-2 list-disc ml-4">
                    <li className="pl-2">Si la oferta caduca y no se lleva a cabo, se te reembolsarán los 15€.</li>
                    <li className="pl-2">Si la oferta se completa, estos {anticipatedCharge}€ se descontarán del importe total a pagar. Sin embargo, si cancelas tu participación una vez completada la oferta, no se devolverán los 15€</li>
                  </ul>
                  <div className="flex items-start gap-2 mt-4">
                    <input 
                      type="checkbox" 
                      id="accept-conditions"
                      checked={acceptedConditions}
                      onChange={(e) => setAcceptedConditions(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 cursor-pointer"
                    />
                    <label 
                      htmlFor="accept-conditions" 
                      className="text-sm text-white cursor-pointer select-none"
                    >
                      Acepto estas condiciones
                    </label>
                  </div>
                </div>
              </div>
			</div>

				<Separator />

				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-1.5">
							<ClockIcon className="!h-4 !w-4" />
							<span className="text-sm font-bold text-white">{GetTimeRemaining(offer.target_completition_date)}</span>
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
					typeOfPost="Oferta"
					subscribers={currentProgress}
					subscribedByUser={isSubscribed}
					user_id={currentUser?.id || null}
					onSubscriptionChange={handleSubscriptionChange}
					variant="switch"
					disabled={!acceptedConditions && !isSubscribed}
				/>
				</div>

				<Separator />
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-8">
				<div>
					<AltenatingButtons
						buttonsContent={slidingButtonsContent}
						textSize="text-xl" />
				</div>
				<div></div>
			</div>

			<CommentsSection postType="Offer" postId={offer.id} currentUser={currentUser} comments={comments} />

			<div className="py-8">
				<div className="mb-6">
					<S1>Más ofertas de la empresa.</S1>
				</div>

				{businessOffers && businessOffers.length > 0 ? (
					<Carousel
						opts={{
							align: "start",
							loop: true,
						}}
						className="w-full"
					>
						<CarouselContent className="-ml-2 md:-ml-4">
							{businessOffers.filter((o) => o.id !== offer.id).map((businessOffer) => (
								<CarouselItem key={businessOffer.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/5">
									<PostCard post={businessOffer} />
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-0" />
						<CarouselNext className="right-0" />
					</Carousel>
				) : (
					<B1 className="text-lightgrey">No hay más ofertas de esta empresa.</B1>
				)}
			</div>
		</div>
	);
}

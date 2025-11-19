"use client";

import { ProductImages } from "@/components/products/product-images";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GetRelativeTime } from "@/lib/services/utilities";
import { Users } from "lucide-react";
import { IPetition } from "@/lib/services/types";
import { useEffect, useState } from "react";
import { SubscribeButton } from "../buttons/subscribe-button";

interface PetitionDetailsProps {
	petition: IPetition;
	subscribedByUser: boolean;
	userUuid: string | null;
}

const images = {
	images: ["/placeholder.png", "/placeholder.png", "/placeholder.png", "/placeholder.png"],
};

export function PetitionDetails({ petition, subscribedByUser, userUuid }: PetitionDetailsProps) {
	const [currentProgress, setCurrentProgress] = useState(petition.current_progress);
	const [isSubscribed, setIsSubscribed] = useState(subscribedByUser);

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

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid lg:grid-cols-2 gap-8 mb-12">
				<ProductImages images={images.images} />

				<div className="space-y-6">
					<div className="flex flex-wrap gap-2 mb-3">
						{petition.tags && petition.tags.length > 0 ? (
							petition.tags.map((tagItem, index) => (
								<span
									key={index}
									className="bg-primary text-black text-xs font-black px-3 py-1 rounded-full"
								>
									{tagItem.Tag.name.toUpperCase()}
								</span>
							))
						) : (
							<span className="bg-primary text-black text-xs font-black px-3 py-1 rounded-full">
								SIN ETIQUETAS
							</span>
						)}
					</div>
					<h1 className="text-4xl font-black mb-4">{petition.title}</h1>

					<div className="flex items-center gap-3 mb-6">
						<Avatar className="w-10 h-10 border-2 border-black">
							<AvatarFallback className="bg-primary text-black font-bold">
								{petition.User?.username?.charAt(0).toLocaleUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-black">@{petition.User?.username}</div>
							<div className="text-xs text-muted-foreground">{GetRelativeTime(petition.created_at)}</div>
						</div>
					</div>

					<Separator />

					<div className="mb-6">
						<div className="flex items-center justify-between mb-3">
							<span className="text-lg font-black">Progreso del objetivo</span>
							<span className="text-lg font-black">
								{petition.current_progress} de {petition.target_progress}{" "}
								<Users className="w-5 h-5 inline" />
							</span>
						</div>
						<div className="flex flex-col gap-2">
							<Progress value={petitionCompletionPercentage} />
						</div>
						<div className="text-sm font-bold text-muted-foreground">
							{currentProgress >= petition.target_progress ? (
								<span className="text-green-600">¡Objetivo alcanzado!</span>
							) : (
								`¡Solo faltan ${
									petition.target_progress - currentProgress
								} usuarios más para desbloquear esta oferta!`
							)}
						</div>
					</div>

					<Separator />

					<div className="bg-muted rounded-2xl p-6 mb-6 border-3 border-black">
						<h3 className="font-black text-lg mb-3">Descripción</h3>
						<p className="text-sm leading-relaxed mb-4">{petition.text}</p>
					</div>
				</div>
			</div>

			<div className="bg-muted rounded-2xl border-3  p-6">
				<div className="flex items-center gap-4 mb-6">
					<div className="flex -space-x-3">
						{[...Array(Math.min(10, currentProgress))].map((_, i) => (
							<Avatar key={i} className="w-10 h-10 border-2 border-primary">
								<AvatarFallback
									className={`${
										i % 3 === 0
											? "bg-primary text-black"
											: i % 3 === 1
											? "bg-white text-black"
											: "bg-black text-primary border-2 border-primary"
									} text-xs font-bold`}
								>
									U{i + 1}
								</AvatarFallback>
							</Avatar>
						))}
						{currentProgress > 10 && (
							<div className="w-10 h-10 border-2 border-primary rounded-full bg-white flex items-center justify-center">
								<span className="text-xs font-black">+{currentProgress - 10}</span>
							</div>
						)}
					</div>
					<div className="flex-1">
						<div className="text-white font-black text-lg">
							{currentProgress} {currentProgress === 1 ? "usuario apuntado" : "usuarios apuntados"}
						</div>
					</div>
				</div>

				<SubscribeButton
					post_id={petition.id}
					typeOfPost="Petición"
					subscribers={currentProgress}
					subscribedByUser={isSubscribed}
					user_id={userUuid}
					onSubscriptionChange={handleSubscriptionChange}
					fullWidth={true}
				/>
			</div>
		</div>
	);
}

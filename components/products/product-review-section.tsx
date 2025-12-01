"use client";

import { RatingDistribution } from "@/app/products/[id]/page-services";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui-custom/carousel";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui-custom/dialog";
import { IProduct, IReview } from "@/lib/services/types";
import { Plus, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProductReviewsSummaryCard } from "../cards/product-reviews-summary-card";
import { UserReviewCard } from "../cards/user-review-card";
import { ProductReviewForm } from "../forms/product-review-form";
import { Button } from "../ui-custom/button";

interface ProductReviewSectionProps {
	product: IProduct;
	ratingDistribution?: RatingDistribution[];
	numOfReviews: number;
	productReviews?: IReview[];
	userId: string;
}

export function ProductReviewSection({
	product,
	numOfReviews,
	productReviews,
	userId,
}: ProductReviewSectionProps) {
	const router = useRouter();
	const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);

	const handleSuccess = () => {
		setIsCreateReviewOpen(false);
		router.refresh();
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h3 className="text-xl font-semibold">Reviews ({numOfReviews})</h3>
				<Button onClick={() => setIsCreateReviewOpen(true)}>
					<Plus className="h-4 w-4 mr-1" />
					Crear reseña
				</Button>
			</div>

			<div className="w-full px-12">
				{productReviews && productReviews.length > 0 ? (
					<Carousel
						opts={{
							align: "start",
						}}
						className="w-full"
					>
						<CarouselContent>
							{productReviews.map((review) => (
								<CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
									<div className="p-1 h-full">
										<UserReviewCard
											review={review}
											currentUserId={userId}
											productId={product.id}
										/>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				) : (
					<p className="text-lightgrey text-center py-8">No hay reseñas para este producto.</p>
				)}
			</div>

			<Dialog open={isCreateReviewOpen} onOpenChange={setIsCreateReviewOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Crear nueva reseña</DialogTitle>
						<DialogDescription>Comparte tu experiencia con {product.name}</DialogDescription>
					</DialogHeader>
					<ProductReviewForm
						onCancel={() => setIsCreateReviewOpen(false)}
						onSuccess={handleSuccess}
						userUuid={userId}
						productId={product.id}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

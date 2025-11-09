"use client";

import { IProduct, IReview } from "@/lib/services/types";
import { ProductReviewsSummaryCard } from "../cards/product-reviews-summary-card";
import { UserReviewCard } from "../cards/user-review-card";
import { RatingDistribution } from "@/app/products/[id]/page-services";
import { Button } from "../ui/button";
import { useState } from "react";
import { Star, Plus } from "lucide-react";
import { CreateProductReviewForm } from "../forms/create-product-review-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ProductReviewSectionProps {
	product: IProduct;
	ratingDistribution?: RatingDistribution[];
	numOfReviews: number;
	productReviews?: IReview[];
	userId: string;
}

export function ProductReviewSection({
	product,
	ratingDistribution,
	numOfReviews,
	productReviews,
	userId,
}: ProductReviewSectionProps) {
	const [reviewFilter, setReviewFilter] = useState("all");
	const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);

	return (
		<div className="space-y-6">
			<ProductReviewsSummaryCard
				rating={product.rating}
				ratingDistribution={ratingDistribution}
				numOfReviews={numOfReviews}
			/>

			<div className="flex items-center justify-between">
				<div className="flex gap-2 flex-wrap">
					<Button
						variant={reviewFilter === "all" ? "default" : "outline"}
						size="sm"
						onClick={() => setReviewFilter("all")}
					>
						Todas
					</Button>
					{[5, 4, 3, 2, 1].map((rating) => (
						<Button
							key={rating}
							variant={reviewFilter === rating.toString() ? "default" : "outline"}
							size="sm"
							onClick={() => setReviewFilter(rating.toString())}
						>
							{rating} <Star className="h-3 w-3 ml-1" />
						</Button>
					))}
				</div>

				<Button onClick={() => setIsCreateReviewOpen(true)}>
					<Plus className="h-4 w-4 mr-1" />
					Crear reseña
				</Button>
			</div>

			<div className="space-y-4">
				{productReviews && productReviews.length > 0 ? (
					productReviews.map((review) => <UserReviewCard key={review.id} review={review} />)
				) : (
					<p className="text-muted-foreground">No hay reseñas para este producto.</p>
				)}
			</div>

			<Dialog open={isCreateReviewOpen} onOpenChange={setIsCreateReviewOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Crear nueva reseña</DialogTitle>
						<DialogDescription>Comparte tu experiencia con {product.name}</DialogDescription>
					</DialogHeader>
					<CreateProductReviewForm
						onCancel={() => setIsCreateReviewOpen(false)}
						userUuid={userId}
						productId={product.id}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

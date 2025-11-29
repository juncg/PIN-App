"use client";

import { RatingDistribution } from "@/app/products/[id]/page-services";
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
	ratingDistribution,
	numOfReviews,
	productReviews,
	userId,
}: ProductReviewSectionProps) {
	const router = useRouter();
	const [reviewFilter, setReviewFilter] = useState("all");
	const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);

	const handleSuccess = () => {
		setIsCreateReviewOpen(false);
		router.refresh();
	};

	const filteredReviews =
		reviewFilter === "all"
			? productReviews
			: productReviews?.filter((review) => review.stars === parseInt(reviewFilter));

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
				{filteredReviews && filteredReviews.length > 0 ? (
					filteredReviews.map((review) => (
						<UserReviewCard key={review.id} review={review} currentUserId={userId} productId={product.id} />
					))
				) : (
					<p className="text-muted">
						{reviewFilter === "all"
							? "No hay reseñas para este producto."
							: `No hay reseñas con ${reviewFilter} estrellas.`}
					</p>
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

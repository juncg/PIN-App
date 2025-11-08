import { IProduct, IReview } from "@/lib/services/types";
import { ProductReviewsSummaryCard } from "../cards/product-reviews-summary-card";
import { UserReviewCard } from "../cards/user-review-card";
import { RatingDistribution } from "@/app/products/[id]/page-services";

interface ProductReviewSectionProps {
	product: IProduct;
	ratingDistribution?: RatingDistribution[];
	numOfReviews: number;
	productReviews?: IReview[];
}

export function ProductReviewSection({
	product,
	ratingDistribution,
	numOfReviews,
	productReviews,
}: ProductReviewSectionProps) {
	return (
		<div className="space-y-6">
			<ProductReviewsSummaryCard
				rating={product.rating}
				ratingDistribution={ratingDistribution}
				numOfReviews={numOfReviews}
			/>

			<div className="space-y-4">
				{productReviews && productReviews.length > 0 ? (
					productReviews.map((review) => <UserReviewCard key={review.id} review={review} />)
				) : (
					<p className="text-muted-foreground">No hay reseñas para este producto.</p>
				)}
			</div>
		</div>
	);
}

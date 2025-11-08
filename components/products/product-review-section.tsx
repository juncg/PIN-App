import { IProduct } from "@/lib/services/types";
import { ProductReviewsSummaryCard } from "../cards/product-reviews-summary-card";
import { UserReviewCard } from "../cards/user-review-card";
import { RatingDistribution } from "@/app/products/[id]/page-services";

interface ProductReviewSectionProps {
	product: IProduct;
	ratingDistribution?: RatingDistribution[];
	numOfReviews: number;
}

export function ProductReviewSection({ product, ratingDistribution, numOfReviews }: ProductReviewSectionProps) {
	return (
		<div className="space-y-6">
			<ProductReviewsSummaryCard
				rating={product.rating}
				ratingDistribution={ratingDistribution}
				numOfReviews={numOfReviews}
			/>
			<UserReviewCard />
		</div>
	);
}

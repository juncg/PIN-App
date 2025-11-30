import { RatingDistribution } from "@/app/products/[id]/page-services";
import { Star } from "lucide-react";
import { Card } from "../ui-custom/card";
import { Progress } from "../ui-custom/progress";

interface ProductReviewsSummaryCardProps {
	rating: number | null;
	ratingDistribution?: RatingDistribution[];
	numOfReviews: number;
}

export function ProductReviewsSummaryCard({
	rating,
	ratingDistribution,
	numOfReviews,
}: ProductReviewsSummaryCardProps) {
	return (
		<Card className="p-6">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="text-center">
					<div className="text-5xl font-bold mb-2">{rating ?? 0}</div>
					<div className="flex items-center justify-center gap-1 mb-2">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-5 w-5 ${
									i < Math.floor(rating ?? 0) ? "fill-amber-500 text-amber-500" : "text-muted"
								}`}
							/>
						))}
					</div>
					<p className="text-sm text-muted">Basado en {numOfReviews} reseñas</p>
				</div>

				<div className="space-y-2">
					{ratingDistribution?.map((dist) => (
						<div key={dist.stars} className="flex items-center gap-3">
							<div className="flex items-center gap-1 w-16">
								<span className="text-sm">{dist.stars}</span>
								<Star className="h-3 w-3 fill-amber-500 text-amber-500" />
							</div>
							<Progress value={dist.percentage} className="flex-1" />
							<span className="text-sm text-muted w-12 text-right">{dist.count}</span>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}

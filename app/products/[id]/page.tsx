import { ProductImages } from "@/components/products/product-images";
import { ProductReviewSection } from "@/components/products/product-review-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Badge } from "@/components/ui-custom/badge";
import { Button } from "@/components/ui-custom/button";
import { Card } from "@/components/ui-custom/card";
import { Separator } from "@/components/ui-custom/separator";
import { B1, H1, H2, H3 } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { ArrowRightIcon, ArrowUpRight, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { ProductDetailsServices } from "./page-services";

interface ProductPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function ProductsPage({ params }: ProductPageProps) {
	const { id } = await params;
	const { product, ratingDistribution, numOfReviews, productReviews } = await ProductDetailsServices(id);
	const userUuid = await getUserUuid();

	if (!product) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid lg:grid-cols-[750px_1fr] gap-8 mb-12">
				<div>
					<ProductImages images={product.images || []} thumbnailPosition="left" />
				</div>

				<div className="space-y-6">
					<div className="flex items-start gap-1.5 text-sm text-muted">
						<Link
							href={
								product.businesses?.[0]?.business?.id
									? `/businesses/${product.businesses[0].business.id}`
									: "#"
							}
							className="hover:underline"
						>
							<span className="text-lightgrey">
								{product.businesses?.[0]?.business?.name?.toLocaleUpperCase() || "Tienda sin nombre"}
							</span>
						</Link>
						<CheckCircle2 className="h-4 w-4" />
					</div>

					<div>
						<H1 className="text-3xl font-bold mb-2">{product.name}.</H1>
					</div>

					{/* Rating */}
					<div className="flex items-center gap-2">
						{[...Array(5)].map((_, i) => (
							<Star
								key={i}
								className={`h-4 w-4 ${
									i < (product.rating ?? 0) ? "fill-white text-white" : "text-zinc-700"
								}`}
							/>
						))}
						<span className="text-sm text-lightgrey">
							({numOfReviews} {numOfReviews === 1 ? "Reseña" : "Reseñas"})
						</span>
					</div>

					<div className="flex items-baseline gap-3 mb-1">
						<H2 className="text-4xl font-bold">{product.msrp?.toFixed(2)}€</H2>
					</div>

					<div>
						<B1 className="text-lightgrey">{product.description}</B1>
					</div>

					<div className="flex items-start gap-1.5 text-md">
						<Link href={`/businesses/${product.businesses?.[0].business.id}`} className="hover:underline">
							<span className="text-lightgrey">Ver en la web de la empresa</span>
						</Link>
						<ArrowUpRight className="h-4 w-4" />
					</div>

					<Button className="w-full" size="lg">
						Crear una petición de este producto
					</Button>
				</div>
			</div>

			<ProductReviewSection
				product={product}
				productReviews={productReviews}
				numOfReviews={numOfReviews}
				userId={userUuid || ""}
			/>
		</div>
	);
}

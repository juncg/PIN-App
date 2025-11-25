import { ProductImages } from "@/components/products/product-images";
import { ProductReviewSection } from "@/components/products/product-review-section";
import { H3 } from "@/components/ui-custom/typography";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { ArrowRightIcon, Star } from "lucide-react";
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
			<div className="grid lg:grid-cols-2 gap-8 mb-12">
				<ProductImages images={product.images || []} />

				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold mb-2">{product.name}</h1>
						<div className="flex items-center gap-4 mb-4">
							<div className="flex items-center gap-1">
								<Star className="h-5 w-5 fill-amber-500 text-amber-500" />
								<span className="font-semibold">{product.rating || 0.0}</span>
								<span className="text-muted-foreground">{numOfReviews} reseñas</span>
							</div>
						</div>
					</div>

					<Separator />

					<div>
						<div className="flex items-baseline gap-3 mb-2">
							<span className="text-4xl font-bold text-primary">{product.msrp}€</span>
						</div>
						<p className="text-sm text-muted-foreground">Precio incluye IVA</p>
					</div>

					<Separator />

					<div>
						<h1 className="text-3xl font-bold mb-2">Descripción</h1>
						<p className="text-muted-foreground">{product.description}</p>
					</div>

					<Separator />

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarImage src={"/placeholder.png"} />
									<AvatarFallback>TS</AvatarFallback>
								</Avatar>
								<span className="font-semibold">
									{product.businesses?.[0]?.business?.name || "Tienda sin nombre"}
								</span>
							</div>

							{product.businesses?.[0]?.business?.id && (
								<Link href={`/businesses/${product.businesses[0].business.id}`}>
									<Button variant="link" className="inline-flex items-center gap-2">
										Ver perfil de empresa <ArrowRightIcon className="h-4 w-4" />
									</Button>
								</Link>
							)}
						</div>
					</Card>

					{/*<Separator />

					<div>
						<h1 className="text-3xl font-bold mb-2">Alguna vaina mas?</h1>
						<p className="text-muted-foreground">
							No se si tenemos que poner los tipicos botones de comprar y demas, asi que dejo este
							apartado por ahora de bonus
						</p>
					</div>*/}
				</div>
			</div>

			<div className="space-y-6">
				<H3>Reseñas</H3>

				<Separator />

				<ProductReviewSection
					product={product}
					ratingDistribution={ratingDistribution}
					numOfReviews={numOfReviews}
					productReviews={productReviews}
					userId={userUuid || ""}
				/>
			</div>
		</div>
	);
}

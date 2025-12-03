import { ProductImages } from "@/components/products/product-images";
import { ProductReviewSection } from "@/components/products/product-review-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Badge } from "@/components/ui-custom/badge";
import { Button } from "@/components/ui-custom/button";
import { Card } from "@/components/ui-custom/card";
import { Separator } from "@/components/ui-custom/separator";
import { B1, B2, H1, H2, H3 } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { ArrowRightIcon, ArrowUpRight, CheckCircle2, Star } from "lucide-react";
import Link from "next/link";
import { ProductDetailsServices } from "./page-services";
import { ProductCardHorizontal } from "@/components/cards/product-card-horizontal";
import { PostCardHorizontal } from "@/components/cards/post-card-horizontal";

interface ProductPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function ProductsPage({ params }: ProductPageProps) {
	const { id } = await params;
	const {
		product,
		numOfReviews,
		productReviews,
		relatedProducts,
		relatedOffers,
		relatedPetitions,
		numOfRelatedOffers,
		numOfRelatedPetitions,
	} = await ProductDetailsServices(id);
	const userUuid = await getUserUuid();

	console.log("relatedPetitions", relatedPetitions);
	console.log("relatedOffers", relatedOffers);

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

			<div className="flex flex-row justify-center gap-8 py-8">
				<div className="flex flex-col items-baseline gap-8 w-[70%]">
					<div>
						<H3>trozo de descripcion bla bla</H3>
						<div className="mt-4">
							<B1 className="text-lightgrey">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
								incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
								exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
								dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
								Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
								mollit anim id est laborum.
							</B1>
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2 mb-4">
							<H3>Ofertas.</H3>
							<B2 className="text-lightgrey">
								{numOfRelatedOffers} ofertas relacionadas a este producto.
							</B2>
						</div>

						<div className="flex flex-col items-baseline gap-4">
							{relatedOffers.length === 0 ? (
								<p className="text-center text-lightgrey-foreground">
									No se encontraron ofertas relacionadas a este producto.
								</p>
							) : (
								relatedOffers.map((offer) => <PostCardHorizontal key={offer.id} post={offer} />)
							)}
						</div>
					</div>

					<div>
						<div className="flex items-baseline gap-2 mb-4">
							<H3>Peticiones.</H3>
							<B2 className="text-lightgrey">
								{numOfRelatedPetitions} peticiones relacionadas a este producto.
							</B2>
						</div>

						<div className="flex flex-col items-baseline gap-4">
							{relatedPetitions.length === 0 ? (
								<p className="text-center text-lightgrey-foreground">
									No se encontraron peticiones relacionadas a este producto.
								</p>
							) : (
								relatedPetitions.map((petition) => (
									<PostCardHorizontal key={petition.id} post={petition} />
								))
							)}
						</div>
					</div>
				</div>

				<div className="flex flex-col items-baseline gap-8 w-[30%]">
					<Link href={"/products"}>
						<B1>Productos relacionados.</B1>
					</Link>

					{relatedProducts?.map((product) => (
						<ProductCardHorizontal key={product.id} {...product} />
					))}
				</div>
			</div>

			<div className="py-8">
				<ProductReviewSection
					product={product}
					productReviews={productReviews}
					numOfReviews={numOfReviews}
					userId={userUuid || ""}
				/>
			</div>
		</div>
	);
}

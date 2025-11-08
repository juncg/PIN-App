"use client";

import { Button } from "@/components/ui/button";
import { ISearchParams } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, ArrowRightIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { IProduct } from "@/lib/services/types";
import Link from "next/link";
import { Card, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductReviewSection } from "./product-review-section";
import { RatingDistribution } from "@/app/products/[id]/page-services";

interface ProductDetailsProps {
	product: IProduct | null;
	ratingDistribution?: RatingDistribution[];
	numOfReviews: number;
}

export function ProductDetails({ product, ratingDistribution, numOfReviews }: ProductDetailsProps) {
	const [selectedImage, setSelectedImage] = useState(0);

	const product2 = {
		images: ["/placeholder.png", "/placeholder.png", "/placeholder.png", "/placeholder.png"],
	};

	if (!product) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid lg:grid-cols-2 gap-8 mb-12">
				<div className="space-y-4">
					<div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
						<Image src="/placeholder.png" alt="Product image" fill className="object-cover" unoptimized />
						<Button
							variant="ghost"
							size="icon"
							className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
							onClick={() =>
								setSelectedImage((prev) => (prev === 0 ? product2.images.length - 1 : prev - 1))
							}
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
							onClick={() =>
								setSelectedImage((prev) => (prev === product2.images.length - 1 ? 0 : prev + 1))
							}
						>
							<ChevronRight className="h-6 w-6" />
						</Button>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{product2.images.map((image, index) => (
							<button
								key={index}
								onClick={() => setSelectedImage(index)}
								className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
									selectedImage === index
										? "border-primary"
										: "border-transparent hover:border-muted-foreground/50"
								}`}
							>
								<Image
									src={image || "/placeholder.svg"}
									alt={`Nombre del producto ${index + 1}`}
									fill
									className="object-cover"
								/>
							</button>
						))}
					</div>
				</div>

				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold mb-2">{product.name}</h1>
						<div className="flex items-center gap-4 mb-4">
							<div className="flex items-center gap-1">
								<Star className="h-5 w-5 fill-amber-500 text-amber-500" />
								<span className="font-semibold">{product.rating || 0.0}</span>
								<span className="text-muted-foreground">5000 reseñas</span>
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

					<Separator />

					<div>
						<h1 className="text-3xl font-bold mb-2">Alguna vaina mas?</h1>
						<p className="text-muted-foreground">
							No se si tenemos que poner los tipicos botones de comprar y demas, asi que dejo este
							apartado por ahora de bonus
						</p>
					</div>
				</div>
			</div>

			<Tabs defaultValue="extra" className="mb-12">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="extra">Algo mas?</TabsTrigger>
					<TabsTrigger value="reviews">Reseñas ({numOfReviews})</TabsTrigger>
				</TabsList>

				<TabsContent value="extra" className="space-y-4">
					<Card className="p-6">
						<h3 className="text-xl font-semibold mb-4">
							Aqui podriamos dar mas detalles del producto o alguna vaina asi que se nos ocurra
						</h3>
						<p className="text-muted-foreground mb-6">
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore ea odio est illo accusamus
							facere vero atque consequuntur, dolores assumenda. Perferendis beatae provident sit
							excepturi illum dicta doloribus voluptate maiores.
						</p>
					</Card>
				</TabsContent>

				<TabsContent value="reviews" className="space-y-4">
					<ProductReviewSection
						product={product}
						ratingDistribution={ratingDistribution}
						numOfReviews={numOfReviews}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

import { Button } from "@/components/ui/button";
import { ISearchParams } from "@/types";
import Image from "next/image";
import { useState } from "react";
import {
	Star,
	ShoppingCart,
	Heart,
	Share2,
	Store,
	Truck,
	Shield,
	ThumbsUp,
	ThumbsDown,
	MoreHorizontal,
	ChevronLeft,
	ChevronRight,
	Check,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

export function ProductDetails() {
	const [selectedImage, setSelectedImage] = useState(0);

	const product = {
		images: ["/placeholder.png", "/placeholder.png", "/placeholder.png", "/placeholder.png"],
	};

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
								setSelectedImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
							}
						>
							<ChevronLeft className="h-6 w-6" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
							onClick={() =>
								setSelectedImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
							}
						>
							<ChevronRight className="h-6 w-6" />
						</Button>
					</div>
					<div className="grid grid-cols-4 gap-2">
						{product.images.map((image, index) => (
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
						<h1 className="text-3xl font-bold mb-2">nombre del producto</h1>
						<div className="flex items-center gap-4 mb-4">
							<div className="flex items-center gap-1">
								<Star className="h-5 w-5 fill-amber-500 text-amber-500" />
								<span className="font-semibold">4.5</span>
								<span className="text-muted-foreground">x reseñas</span>
							</div>
						</div>
					</div>

					<Separator />

					<div>
						<div className="flex items-baseline gap-3 mb-2">
							<span className="text-4xl font-bold text-primary">20.55€</span>
						</div>
						<p className="text-sm text-muted-foreground">Precio incluye IVA</p>
					</div>
				</div>
			</div>
		</div>
	);
}

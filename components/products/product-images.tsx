"use client";

import { Button } from "@/components/ui-custom/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
	images: string[];
	thumbnailPosition?: "bottom" | "left";
}

export function ProductImages({ images, thumbnailPosition = "bottom" }: ProductImagesProps) {
	const [selectedImage, setSelectedImage] = useState(0);

	const mainImageContent = (
		<div className="relative aspect-square bg-lightgrey rounded-lg overflow-hidden">
			<Image
				src={images[selectedImage] || "/placeholder.png"}
				alt="Product image"
				fill
				className="object-cover"
				unoptimized
			/>
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black"
				onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
			>
				<ChevronLeft className="h-6 w-6" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black"
				onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
			>
				<ChevronRight className="h-6 w-6" />
			</Button>
		</div>
	);

	const thumbnailsContent = (
		<div className={cn(thumbnailPosition === "bottom" ? "grid grid-cols-4 gap-2" : "flex flex-col gap-2")}>
			{images.map((image, index) => (
				<button
					key={index}
					onClick={() => setSelectedImage(index)}
					className={cn(
						"relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
						selectedImage === index ? "border-black" : "border-transparent hover:border-lightgrey/50"
					)}
				>
					<Image
						src={image || "/placeholder.svg"}
						alt={`Imagen del producto ${index + 1}`}
						fill
						className="object-cover"
						unoptimized
					/>
				</button>
			))}
		</div>
	);

	return (
		<div className={cn(thumbnailPosition === "bottom" ? "space-y-4" : "flex gap-4")}>
			{thumbnailPosition === "left" && <div className="w-24 shrink-0">{thumbnailsContent}</div>}
			<div className="flex-1">{mainImageContent}</div>
			{thumbnailPosition === "bottom" && thumbnailsContent}
		</div>
	);
}

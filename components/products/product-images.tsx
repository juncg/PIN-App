"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ProductImages({ images }: { images: string[] }) {
	const [selectedImage, setSelectedImage] = useState(0);

	return (
		<div className="space-y-4">
			<div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
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
					className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
					onClick={() => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
				>
					<ChevronLeft className="h-6 w-6" />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
					onClick={() => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
				>
					<ChevronRight className="h-6 w-6" />
				</Button>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{images.map((image, index) => (
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
							alt={`Imagen del producto ${index + 1}`}
							fill
							className="object-cover"
							unoptimized
						/>
					</button>
				))}
			</div>
		</div>
	);
}

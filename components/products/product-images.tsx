"use client";

import { Button } from "@/components/ui-custom/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface ProductImagesProps {
	images: string[];
	thumbnailPosition?: "bottom" | "left";
}

export function ProductImages({ images, thumbnailPosition = "bottom" }: ProductImagesProps) {
	const [selectedImage, setSelectedImage] = useState(0);

	// Embla setup
	const [emblaRef, embla] = useEmblaCarousel({ loop: true });

	// When the slide changes (user drags), update state
	const onSelect = useCallback(() => {
		if (!embla) return;
		setSelectedImage(embla.selectedScrollSnap());
	}, [embla]);

	useEffect(() => {
		if (!embla) return;
		embla.on("select", onSelect);
	}, [embla, onSelect]);

	// When clicking a thumbnail or arrows → slide Embla
	useEffect(() => {
		if (!embla) return;
		embla.scrollTo(selectedImage);
	}, [selectedImage, embla]);

	const handlePrev = () => embla && embla.scrollPrev();
	const handleNext = () => embla && embla.scrollNext();

	// ===============================
	// MAIN IMAGE CAROUSEL
	// ===============================
	const mainImageContent = (
		<div className="relative bg-lightgrey rounded-lg overflow-hidden">
			{/* Embla viewport */}
			<div className="embla" ref={emblaRef}>
				<div className="embla__container flex">
					{images.map((src, i) => (
						<div className="embla__slide relative min-w-0 flex-[0_0_100%] aspect-square" key={i}>
							<Image
								src={src || "/placeholder.png"}
								alt="Product image"
								fill
								className="object-cover"
								unoptimized
							/>
						</div>
					))}
				</div>
			</div>

			{/* Arrows */}
			<Button
				variant="ghost"
				size="icon"
				className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black"
				onClick={handlePrev}
			>
				<ChevronLeft className="h-6 w-6" />
			</Button>
			<Button
				variant="ghost"
				size="icon"
				className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black"
				onClick={handleNext}
			>
				<ChevronRight className="h-6 w-6" />
			</Button>
		</div>
	);

	// ===============================
	// THUMBNAILS
	// ===============================
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

	// ===============================
	// LAYOUT
	// ===============================
	return (
		<div className={cn(thumbnailPosition === "bottom" ? "space-y-4" : "flex gap-4")}>
			{thumbnailPosition === "left" && <div className="w-24 shrink-0">{thumbnailsContent}</div>}
			<div className="flex-1">{mainImageContent}</div>
			{thumbnailPosition === "bottom" && thumbnailsContent}
		</div>
	);
}
"use client";

import { Button } from "@/components/ui-custom/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import WheelGestures from "embla-carousel-wheel-gestures";

interface ProductImagesProps {
	images: string[];
	thumbnailPosition?: "bottom" | "left";
}

export function ProductImages({ images, thumbnailPosition = "bottom" }: ProductImagesProps) {
	const [selectedImage, setSelectedImage] = useState(0);
	const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
	const maxVisibleThumbnails = 5;

	// Embla setup
	const [emblaRef, embla] = useEmblaCarousel({
		loop: images.length > 1,
		watchDrag: images.length > 1, // ✅ disables drag when only 1 image
	},
		[WheelGestures()]

	);


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

	const handleNextThumbnails = () => {
		if (thumbnailStartIndex + maxVisibleThumbnails < images.length) {
			setThumbnailStartIndex(thumbnailStartIndex + 1);
		}
	};

	const handlePrevThumbnails = () => {
		if (thumbnailStartIndex > 0) {
			setThumbnailStartIndex(thumbnailStartIndex - 1);
		}
	};

	const visibleThumbnails = images.slice(thumbnailStartIndex, thumbnailStartIndex + maxVisibleThumbnails);

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

			{/* 🔥 ONLY show arrows if >1 image */}
			{images.length > 1 && (
				<>
					<Button
						variant="ghost"
						size="icon"
						className="
						absolute left-3 top-1/2 -translate-y-1/2 
						bg-black
						hover:bg-white
						text-white shadow-lg
						h-10 w-10 rounded-full
						flex items-center justify-center
						transition
					"
						onClick={handlePrev}
					>
						<ChevronLeft className="h-6 w-6" />
					</Button>

					<Button
						variant="ghost"
						size="icon"
						className="
						absolute right-3 top-1/2 -translate-y-1/2 
						bg-black
						hover:bg-white 
						text-white shadow-lg
						h-10 w-10 rounded-full
						flex items-center justify-center
						transition
					"
						onClick={handleNext}
					>
						<ChevronRight className="h-6 w-6 text-black-500" />
					</Button>
				</>
			)}
		</div>
	);


	// ===============================
	// THUMBNAILS
	// ===============================
	const thumbnailsContent = (
		<div className="relative">
			<div className={cn(thumbnailPosition === "bottom" ? "grid grid-cols-5 gap-2" : "flex flex-col gap-2")}>
				{visibleThumbnails.map((image, index) => {
					const actualIndex = thumbnailStartIndex + index;
					return (
						<button
							key={actualIndex}
							onClick={() => setSelectedImage(actualIndex)}
							className={cn(
								"relative aspect-square rounded-lg overflow-hidden border-2 transition-all",
								selectedImage === actualIndex ? "border-[#C4FF33]" : "border-border hover:border-muted-foreground"
							)}
						>
							<Image
								src={image || "/placeholder.svg"}
								alt={`Imagen del producto ${actualIndex + 1}`}
								fill
								className="object-cover"
								unoptimized
							/>
						</button>
					);
				})}
			</div>
			
			{/* Flecha derecha para ver más thumbnails */}
			{images.length > maxVisibleThumbnails && thumbnailStartIndex + maxVisibleThumbnails < images.length && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white text-white h-8 w-8 rounded-full z-10"
					onClick={handleNextThumbnails}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
			)}
			
			{/* Flecha izquierda para volver atrás en thumbnails */}
			{thumbnailStartIndex > 0 && (
				<Button
					variant="ghost"
					size="icon"
					className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-white text-white h-8 w-8 rounded-full z-10"
					onClick={handlePrevThumbnails}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
			)}
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
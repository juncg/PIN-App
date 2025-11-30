"use client";

// TODO: check if this file can be made without having to calculate anything, just using CSS
// TODO: let videos and gifs play here too

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "@/components/ui-custom/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui-custom/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";

interface PopOutMediaProps {
	images: string[];
	isOpen: boolean;
	onClose: () => void;
	startIndex: number;
}

const MAX_WIDTH = 760;
const MAX_HEIGHT = 520;

function getImageSize(
	naturalWidth: number,
	naturalHeight: number,
	maxWidth: number,
	maxHeight: number
): { width: number; height: number } {
	const widthRatio = maxWidth / naturalWidth;
	const heightRatio = maxHeight / naturalHeight;
	const ratio = Math.min(widthRatio, heightRatio, 1);
	return {
		width: Math.round(naturalWidth * ratio),
		height: Math.round(naturalHeight * ratio),
	};
}

export function PopOutMedia({ images, isOpen, onClose, startIndex }: PopOutMediaProps) {
	const [currentIndex, setCurrentIndex] = useState(startIndex);
	const [sizes, setSizes] = useState<{ width: number; height: number }[]>([]);
	const [api, setApi] = useState<CarouselApi>();

	useEffect(() => {
		setCurrentIndex(startIndex);
	}, [startIndex]);

	useEffect(() => {
		// Load image sizes for all images
		let isMounted = true;
		Promise.all(
			images.map(
				(src) =>
					new Promise<{ width: number; height: number }>((resolve) => {
						const img = new window.Image();
						img.src = src;
						img.onload = () => {
							resolve(getImageSize(img.naturalWidth, img.naturalHeight, MAX_WIDTH, MAX_HEIGHT));
						};
						img.onerror = () => {
							// fallback to max size if error
							resolve({ width: MAX_WIDTH, height: MAX_HEIGHT });
						};
					})
			)
		).then((results) => {
			if (isMounted) setSizes(results);
		});
		return () => {
			isMounted = false;
		};
	}, [images]);

	useEffect(() => {
		if (api && isOpen) {
			api.scrollTo(startIndex, true); // passing 'true' to skip an eye straining animation (we could add a different animation)
		}
	}, [api, startIndex, isOpen]);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-[800px] h-[600px] flex flex-col">
				<DialogHeader>
					<DialogTitle>Imágenes</DialogTitle>
				</DialogHeader>
				<div className="flex-1 flex items-center justify-center pb-4">
					<Carousel className="w-full h-full" setApi={setApi}>
						<CarouselContent>
							{images.map((image, index) => (
								<CarouselItem key={index}>
									<div
										className="flex items-center justify-center w-full h-full bg-black rounded-md"
										style={{ minHeight: `${MAX_HEIGHT}px` }}
									>
										{sizes[index] ? (
											<div
												className="flex items-center justify-center w-full h-full"
												style={{
													height: `${MAX_HEIGHT}px`,
												}}
											>
												<Image
													src={image}
													alt={`Imagen ${index + 1}`}
													width={sizes[index].width}
													height={sizes[index].height}
													className="object-contain"
													unoptimized
												/>
											</div>
										) : (
											// fallback skeleton while loading
											<div className="w-[200px] h-[200px] bg-muted animate-pulse rounded" />
										)}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						{images.length > 1 && (
							<>
								<CarouselPrevious className="left-2" />
								<CarouselNext className="right-2" />
							</>
						)}
					</Carousel>
				</div>
			</DialogContent>
		</Dialog>
	);
}

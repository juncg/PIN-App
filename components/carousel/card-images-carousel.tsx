"use client";

import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui-custom/carousel";

interface CardImagesCarouselProps {
	post?: IOffer | IPetition;
	product?: IProduct;
	displayImages: string[];
}

export function CardImagesCarousel({ post, product, displayImages }: CardImagesCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [canScrollPrev, setCanScrollPrev] = useState(false);
	const [canScrollNext, setCanScrollNext] = useState(false);

	const getHref = () => {
		if (product) return `/products/${product.id}`;
		if (post?.type === "Petition") return `/petitions/${post.id}`;
		return `/offers/${post?.id}`;
	};

	const getAltText = (index: number) => {
		if (product) return `${product.name} - imagen ${index + 1}`;
		return `${post?.title} - imagen ${index + 1}`;
	};

	return (
		<Carousel
			className="w-full"
			onSlideChange={(idx: number) => setCurrentIndex(idx)}
			setApi={(api) => {
				if (!api) return;
				setCanScrollPrev(api.canScrollPrev());
				setCanScrollNext(api.canScrollNext());
				api.on("select", () => {
					setCanScrollPrev(api.canScrollPrev());
					setCanScrollNext(api.canScrollNext());
				});
			}}
		>
			<CarouselContent>
				{displayImages.map((image, index) => (
					<CarouselItem key={index}>
						{product ? (
							<Link href={getHref()}>
								<div className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden">
									<Image
										src={image}
										alt={getAltText(index)}
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
										className="object-cover rounded-2xl border border-darkmode"
										unoptimized
									/>
								</div>
							</Link>
						) : (
							<div className="relative aspect-[4/3] w-full cursor-pointer overflow-hidden">
								<Image
									src={image}
									alt={getAltText(index)}
									fill
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
									className="object-cover rounded-2xl border border-darkmode"
									unoptimized
								/>
							</div>
						)}
					</CarouselItem>
				))}
			</CarouselContent>

			{displayImages.length > 1 && (
				<>
					{canScrollPrev && (
						<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 text-placeholder hover:text-darkmode opacity-0 group-hover:opacity-100 transition-all" />
					)}
					{canScrollNext && (
						<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-placeholder hover:text-darkmode opacity-0 group-hover:opacity-100 transition-all" />
					)}
				</>
			)}
		</Carousel>
	);
}

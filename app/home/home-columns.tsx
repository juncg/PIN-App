"use client";

import { PostCard } from "@/components/cards/post-card";
import { ProductCardHorizontal } from "@/components/cards/product-card-horizontal";
import { SpecialSeparator } from "@/components/separator/special-separator";
import { H2 } from "@/components/ui-custom/typography";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import Lenis from "lenis";
import { useEffect, useRef } from "react";

interface HomeColumnsProps {
	petitions: IPetition[];
	offers: IOffer[];
	products: IProduct[];
	translations: {
		petitions: string;
		offers: string;
		products: string;
	};
}

export function HomeColumns({ petitions, offers, products, translations }: HomeColumnsProps) {
	const petitionsRef = useRef<HTMLDivElement>(null);
	const offersRef = useRef<HTMLDivElement>(null);
	const productsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const lenisInstances: Lenis[] = [];

		if (petitionsRef.current) {
			const lenisPetitions = new Lenis({
				wrapper: petitionsRef.current,
				content: petitionsRef.current,
				duration: 1.2,
				orientation: "vertical",
				gestureOrientation: "vertical",
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 2,
			});
			lenisInstances.push(lenisPetitions);
		}

		if (offersRef.current) {
			const lenisOffers = new Lenis({
				wrapper: offersRef.current,
				content: offersRef.current,
				duration: 1.2,
				orientation: "vertical",
				gestureOrientation: "vertical",
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 2,
			});
			lenisInstances.push(lenisOffers);
		}

		if (productsRef.current) {
			const lenisProducts = new Lenis({
				wrapper: productsRef.current,
				content: productsRef.current,
				duration: 1.2,
				orientation: "vertical",
				gestureOrientation: "vertical",
				smoothWheel: true,
				wheelMultiplier: 1,
				touchMultiplier: 2,
			});
			lenisInstances.push(lenisProducts);
		}

		function raf(time: number) {
			lenisInstances.forEach((lenis) => lenis.raf(time));
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenisInstances.forEach((lenis) => lenis.destroy());
		};
	}, []);

	return (
		<>
			<div className="grid grid-cols-2 items-start !gap-8 flex-1 h-full">
				<div
					ref={petitionsRef}
					className="flex flex-col items-baseline pb-8 overflow-y-auto h-full scrollbar-hide w-full"
				>
					<div className="sticky top-0 bg-darkmode pb-4 z-10 border-b border-b-transparent w-full">
						<H2>{translations.petitions}.</H2>
					</div>

					<div className="flex flex-col gap-8">
						{petitions?.map((petition: IPetition) => (
							<PostCard key={petition.id} className="w-full" post={petition} />
						))}
					</div>
				</div>

				<div
					ref={offersRef}
					className="flex flex-col items-start pb-8 overflow-y-auto h-full scrollbar-hide w-full"
				>
					<div className="sticky top-0 bg-darkmode pb-4 z-10 border-b border-b-transparent w-full">
						<H2>{translations.offers}.</H2>
					</div>

					<div className="flex flex-col gap-8">
						{offers?.map((offer: IOffer) => (
							<PostCard key={offer.id} className="w-full" post={offer} />
						))}
					</div>
				</div>
			</div>

			<div className="my-4">
				<SpecialSeparator />
			</div>

			<div
				ref={productsRef}
				className="flex flex-col items-start pb-8 w-1/4 overflow-y-auto h-full scrollbar-hide"
			>
				<div className="sticky top-0 bg-darkmode pb-4 z-10 border-b border-b-transparent w-full">
					<H2>{translations.products}.</H2>
				</div>

				<div className="flex flex-col gap-8">
					{products?.map((product: IProduct) => (
						<ProductCardHorizontal key={product.id} {...product} />
					))}
				</div>
			</div>
		</>
	);
}

import { PostCard } from "@/components/cards/post-card";
import { ProductCardHorizontal } from "@/components/cards/product-card-horizontal";
import { H2 } from "@/components/ui-custom/typography";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import { ISearchParams } from "../../types";
import { HomeServices } from "./page-services";

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, offers, petitions, products } = await HomeServices(searchParams);

	return (
		<section className="flex flex-row justify-center !gap-12 h-[calc(100vh-6rem)]">
			<div className="grid grid-cols-2 items-start !gap-8 flex-1">
				<div className="flex flex-col items-baseline overflow-y-auto h-full scrollbar-hide">
					<div className="sticky top-0 bg-darkmode pb-4 z-10 border-b border-b-transparent w-full">
						<H2>{translator("petitions")}.</H2>
					</div>

					<div className="flex flex-col gap-8">
						{petitions?.map((petition: IPetition) => (
							<PostCard key={petition.id} className="w-full" post={petition} />
						))}
					</div>
				</div>

				<div className="flex flex-col items-start overflow-y-auto h-full scrollbar-hide">
					<div className="sticky top-0 bg-darkmode pb-4 z-10 border-b border-b-transparent w-full">
						<H2>{translator("offers")}.</H2>
					</div>

					<div className="flex flex-col gap-8">
						{offers?.map((offer: IOffer) => (
							<PostCard key={offer.id} className="w-full" post={offer} />
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-col items-start max-w-[26%] overflow-y-auto h-full scrollbar-hide">
				<div className="sticky top-0 bg-darkmode pb-4 z-10 border-b border-b-transparent w-full">
					<H2>{translator("products")}.</H2>
				</div>

				<div className="flex flex-col gap-8">
					{products?.map((product: IProduct) => (
						<ProductCardHorizontal key={product.id} {...product} />
					))}
				</div>
			</div>
		</section>
	);
}

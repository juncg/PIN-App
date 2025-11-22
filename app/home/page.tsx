import { PostCard } from "@/components/cards/post-card";
import { ProductCard } from "@/components/cards/product-card";
import { ProductCardHorizontal } from "@/components/cards/product-card-horizontal";
import { H1 } from "@/components/ui-custom/typography";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { HomeServices } from "./page-services";

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, offers, petitions, products } = await HomeServices(searchParams);

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-[36%]">
				<Link href={"/petitions"}>
					<H1>{translator("petitions")}.</H1>
				</Link>

				{petitions?.map((petition: IPetition) => (
					<PostCard key={petition.id} className="w-full" post={petition} />
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-[36%] mr-12">
				<Link href={"/offers"}>
					<H1>{translator("offers")}.</H1>
				</Link>

				{offers?.map((offer: IOffer) => (
					<PostCard key={offer.id} className="w-full" post={offer} />
				))}
			</div>

			<div className="flex flex-col items-baseline gap-7 w-[26%]">
				<Link href={"/products"}>
					<H1>{translator("products")}.</H1>
				</Link>

				{products?.map((product: IProduct) => (
					<ProductCardHorizontal key={product.id} {...product} />
				))}
			</div>
		</section>
	);
}

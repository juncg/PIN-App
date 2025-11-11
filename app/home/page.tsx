import { PostCard } from "@/components/cards/postCard";
import { ProductCard } from "@/components/cards/productCard";
import { H1 } from "@/components/ui/typography";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { HomeServices } from "./page-services";

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, offers, petitions, products } = await HomeServices(searchParams);

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/petitions"}>
					<H1>{translator("petitions")}</H1>
				</Link>

				{petitions?.map((petition: IPetition) => (
					<PostCard key={petition.id} className="w-full" post={petition} />
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/offers"}>
					<H1>{translator("offers")}</H1>
				</Link>

				{offers?.map((offer: IOffer) => (
					<PostCard key={offer.id} className="w-full" post={offer} />
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/products"}>
					<H1>{translator("products")}</H1>
				</Link>

				{products?.map((product: IProduct) => (
					<ProductCard
						key={product.id}
						props={{
							className: "w-full",
							name: product.name,
							description: product.description,
							businessName: (product.businesses && product.businesses[0]?.business?.name) || "N/A",
							translator: translator,
							id: product.id,
							price: product.msrp || 0,
							rating: product.rating || 0,
						}}
					/>
				))}
			</div>
		</section>
	);
}

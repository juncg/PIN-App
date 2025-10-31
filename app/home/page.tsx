import { PostCard } from "@/components/cards/postCard";
import { ProductCard } from "@/components/cards/productCard";
import { H1 } from "@/components/ui/typography";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { HomeServices } from "./page-services";

export default async function Home({ searchParams }: { searchParams: Promise<{ locale?: string }> }) {
	const params = await searchParams;
	const locale = params.locale || DEFAULT_LOCALE;
	const translator = await getTranslations({ locale, namespace: "home" });
	const userUuid = await getUserUuid();

	const { offers, petitions, products } = await HomeServices();

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/petitions"}>
					<H1>{translator("petitions")}</H1>
				</Link>

				{petitions?.map((petition: IPetition) => (
					<PostCard
						key={petition.id}
						props={{
							className: "w-full",
							typeOfPost: "Petición",
							likedByUser: petition?.liked || false,
							post: petition,
							subscribedByUser: petition?.liked || false,
							userUuid: userUuid || "",
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/offers"}>
					<H1>{translator("offers")}</H1>
				</Link>

				{offers?.map((offer: IOffer) => (
					<PostCard
						key={offer.id}
						props={{
							className: "w-full",
							typeOfPost: "Oferta",
							likedByUser: offer?.liked || false,
							post: offer,
							subscribedByUser: offer?.liked || false,
							userUuid: userUuid || "",
						}}
					/>
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
							businessName: (product.businesses && product.businesses[0].business.name) || "N/A",
						}}
					/>
				))}
			</div>
		</section>
	);
}

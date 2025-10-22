import Link from "next/link";
import { PostCard } from "@/components/cards/postCard";
import { H1 } from "@/components/ui/typography";
import { IOffer, IPetition, IProduct } from "@/lib/services/types";
import { ProductCard } from "@/components/cards/productCard";
import { HomeServices } from "./page-services";

export default async function Home() {
	const { offers, petitions, products } = await HomeServices()

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/offers"}>
					<H1>Peticiones</H1>
				</Link>

				{petitions?.map((petition: IPetition) => (
					<PostCard
						key={petition.id}
						props={{
							className: "w-full",
							businessName: "N/A",
							description: petition.text || "N/A",
							name: petition.title || "N/A",
							typeOfPost: "Petición",
							peopleSignedCurrent: petition.current_progress || 0,
							peopleSignedObjective: petition.target_progress || 0,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/offers"}>
					<H1>Ofertas</H1>
				</Link>

				{offers?.map((offer: IOffer) => (
					<PostCard
						key={offer.id}
						props={{
							className: "w-full",
							businessName: "N/A",
							description: offer.text || "N/A",
							name: offer.title || "N/A",
							typeOfPost: "Oferta",
							peopleSignedCurrent: offer.current_progress || 0,
							peopleSignedObjective: offer.target_progress || 0,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<Link href={"/offers"}>
					<H1>Productos</H1>
				</Link>

				{products?.map((product: IProduct) => (
					<ProductCard
						key={product.id}
						props={{
							className: "w-full",
							name: product.name,
							description: "n/a",
							businessName: product.business?.[0]?.Business?.name || "N/A",
						}}
					/>
				))}
			</div>
		</section>
	);
}

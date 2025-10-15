import { Post } from "@/components/post/post";
import { H1 } from "@/components/ui/typography";
import { GetAllOffers, OfferType } from "@/lib/services/offer";

export default async function Home() {
	const offers = await GetAllOffers();

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8">
				<H1>Ofertas</H1>

				{offers?.map((offer: OfferType) => (
					<Post
						key={offer.id}
						props={{
							className: "w-full",
							companyName: offer.title || "N/A",
							productDescription: offer.text || "N/A",
							productName: offer.title || "N/A",
							typeOfPost: "Oferta",
							peopleSignedCurrent: offer.current_progress || 0,
							peopleSignedObjective: offer.target_progress || 0,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8">
				<H1>Peticiones</H1>

				{offers?.map((offer: OfferType) => (
					<Post
						key={offer.id}
						props={{
							className: "w-full",
							companyName: offer.title || "N/A",
							productDescription: offer.text || "N/A",
							productName: offer.title || "N/A",
							typeOfPost: "Oferta",
							peopleSignedCurrent: offer.current_progress || 0,
							peopleSignedObjective: offer.target_progress || 0,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8">
				<H1>Productos</H1>

				{offers?.map((offer: OfferType) => (
					<Post
						key={offer.id}
						props={{
							className: "w-full",
							companyName: offer.title || "N/A",
							productDescription: offer.text || "N/A",
							productName: offer.title || "N/A",
							typeOfPost: "Oferta",
							peopleSignedCurrent: offer.current_progress || 0,
							peopleSignedObjective: offer.target_progress || 0,
						}}
					/>
				))}
			</div>
		</section>
	);
}

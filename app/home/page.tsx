import { Post } from "@/components/post/post";
import { H1 } from "@/components/ui/typography";
import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IPetition } from "@/lib/services/types";

export default async function Home() {
	const offers = await GetFromDatabase<IOffer>("Offer", "*");
	const petitions = await GetFromDatabase<IPetition>("Petition", "*");

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<H1>Ofertas</H1>

				{offers?.map((offer: IOffer) => (
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

			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<H1>Peticiones</H1>

				{petitions?.map((petition: IPetition) => (
					<Post
						key={petition.id}
						props={{
							className: "w-full",
							companyName: petition.title || "N/A",
							productDescription: petition.text || "N/A",
							productName: petition.title || "N/A",
							typeOfPost: "Petición",
							peopleSignedCurrent: petition.current_progress || 0,
							peopleSignedObjective: petition.target_progress || 0,
						}}
					/>
				))}
			</div>

			<div className="flex flex-col items-baseline gap-8 w-1/5">
				<H1>Productos</H1>

				{offers?.map((offer: IOffer) => (
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

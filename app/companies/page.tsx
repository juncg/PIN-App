import { Post } from "@/components/post/postCard";
import { H1 } from "@/components/ui/typography";
import { GetFromDatabase } from "@/lib/services/general";
import { IBusiness, IOffer } from "@/lib/services/types";

export default async function Home() {
	const businesses = await GetFromDatabase<IBusiness>({ tableName: "Business", select: "*" });

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<H1>Ofertas</H1>

				{businesses?.map((business: IOffer) => (
					<Post
						key={offer.id}
						props={{
							className: "w-full",
							businessName: offer.title || "N/A",
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

import { Post } from "@/components/post/post";
import { GetAllOffers, OfferType } from "@/lib/services/offer";

export default async function Feed() {
	const offers = await GetAllOffers();

	return (
		<section className="flex flex-col items-center justify-center max-w-3xl mx-auto gap-8">
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
		</section>
	);
}

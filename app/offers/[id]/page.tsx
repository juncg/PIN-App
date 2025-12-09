import { OfferDetailsService } from "./page-services";
import { OfferDetails } from "@/components/detail-pages/offer-details-page";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";


interface OfferPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function OfferPage({ params }: OfferPageProps) {
	const { id } = await params;
	const userUuid = await getUserUuid();
	const { offer, comments, currentUser, businessProducts } = await OfferDetailsService(id, userUuid || "");

	if (!offer) {
		return <div>Offer not found</div>;
	}

	const subscribedByUser = offer[0].User_Offer?.some((u) => u.user_id === userUuid && u.subscribed);
	const likedByUser = offer[0].User_Offer?.some((u) => u.user_id === userUuid && u.liked);

	return (
		<OfferDetails
			offer={offer[0]}
			subscribedByUser={subscribedByUser ?? false}
			likedByUser={likedByUser ?? false}
			currentUser={currentUser}
			comments={comments}
			businessProducts={businessProducts}
		/>
	);
}

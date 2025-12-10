import { OfferDetailsService } from "./page-services";
import { OfferDetails } from "@/components/detail-pages/offer-details-page";
import { B1, H1 } from "@/components/ui-custom/typography";
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

	if (!offer || offer.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<H1>Oferta no disponible</H1>
				<B1 className="text-lightgrey">La oferta que buscas no existe o ha sido eliminada.</B1>
			</div>
		);
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

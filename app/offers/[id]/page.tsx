import { OfferDetailsService } from "./page-services";
import { OfferDetails } from "@/components/detail-pages/offer-details-page";
import { getUserUuid } from "@/lib/services/user";

interface OfferPageProps {
    params: Promise<{ id: string }>;
}

export default async function OfferPage({ params }: OfferPageProps) {
    const { id } = await params;
    const offerId = parseInt(id);
    const userUuid = await getUserUuid();

    const { offer, comments, currentUser, businessOffers } = await OfferDetailsService(
        offerId,
        userUuid || ""
    );

    if (!offer) {
        return <div>Offer not found</div>;
    }

    const subscribedByUser = offer.User_Offer?.some(
        (u) => u.user_id === userUuid && u.subscribed
    );

    return (
        <OfferDetails
            offer={offer}
            comments={comments}
            currentUser={currentUser}
            businessOffers={businessOffers}
            subscribedByUser={subscribedByUser}
        />
    );
}

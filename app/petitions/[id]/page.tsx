import { ISearchParams } from "@/types";
import { PetitionDetailsService } from "./page-services";
import { getUserUuid } from "@/lib/services/user";
import { PetitionDetails } from "@/components/detail-pages/petition-details-page";

interface PetitionPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function PetitionPage({ params }: PetitionPageProps) {
	const { id } = await params;
	const { petition, comments } = await PetitionDetailsService(id);
	const userUuid = await getUserUuid();

	if (!petition || petition.length === 0) {
		return <div>Loading...</div>;
	}

	const subscribedByUser = petition[0].User_Petition?.some((u) => u.user_id === userUuid && u.subscribed);

	return (
		<PetitionDetails
			petition={petition[0]}
			subscribedByUser={subscribedByUser ?? false}
			userUuid={userUuid}
			comments={comments}
		/>
	);
}

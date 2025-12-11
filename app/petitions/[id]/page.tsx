import { ISearchParams } from "@/types";
import { PetitionDetailsService } from "./page-services";
import { getUserUuid } from "@/lib/services/user";
import { PetitionDetails } from "@/components/detail-pages/petition-details-page";
import { H1, B1 } from "@/components/ui-custom/typography";

interface PetitionPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function PetitionPage({ params }: PetitionPageProps) {
	const { id } = await params;
	const userUuid = await getUserUuid();
	const { petition, comments, currentUser, businessProducts } = await PetitionDetailsService(id, userUuid || "");

	if (!petition || petition.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<H1>Petición no disponible</H1>
				<B1 className="text-lightgrey">La petición que buscas no existe o ha sido eliminada.</B1>
			</div>
		);
	}

	const subscribedByUser = petition[0].User_Petition?.some((u) => u.user_id === userUuid && u.subscribed);
	const likedByUser = petition[0].User_Petition?.some((u) => u.user_id === userUuid && u.liked);

	return (
		<PetitionDetails
			petition={petition[0]}
			subscribedByUser={subscribedByUser ?? false}
			likedByUser={likedByUser ?? false}
			comments={comments}
			currentUser={currentUser}
			businessProducts={businessProducts}
		/>
	);
}

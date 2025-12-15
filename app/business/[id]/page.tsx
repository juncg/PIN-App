import { FollowButton } from "@/components/buttons/follow-button";
import { BusinessCardHorizontalSmall } from "@/components/cards/business-card-horizontal-small";
import { ForumCard } from "@/components/cards/forum-card";
import { VerifiedIcon } from "@/components/icons/icons";
import { InfinitePostGrid } from "@/components/posts/infinite-post-grid";
import { Separator } from "@/components/ui-custom/separator";
import { B1, H1, H2 } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import Image from "next/image";
import { BusinessProfileServices, loadMoreBusinessOffers, loadMoreBusinessPetitions } from "./page-services";

interface BusinessPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function BusinessProfile({ params, searchParams }: BusinessPageProps) {
	const { id } = await params;
	const currentUserUuid = await getUserUuid();

	const { business, isFollowing, businessForums, similarBusinesses, stats, initialPosts, clientTranslations } =
		await BusinessProfileServices(id, searchParams);

	if (!business) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<H1>Empresa no encontrada</H1>
				<B1>La empresa que buscas no existe o ha sido eliminada.</B1>
			</div>
		);
	}

	return (
		<section className="flex flex-row justify-center items-start gap-16">
			<div className="flex flex-col gap-6 items-start w-full">
				<div className="relative w-full">
					<figure className="relative w-full h-[200px] rounded-b-lg overflow-hidden -mt-8">
						<Image
							src={business.banner || "/placeholder.png"}
							alt="Business banner"
							fill
							className="object-cover"
							unoptimized
						/>
					</figure>

					<figure className="absolute -bottom-[100px] left-8 w-[140px] h-[140px] rounded-full overflow-hidden border border-darkmode">
						<Image
							src={business.profile_picture || "/placeholder.png"}
							alt="Business profile picture"
							fill
							className="object-cover"
							unoptimized
						/>
					</figure>
				</div>

				<div className="flex gap-16 w-full">
					<div className="flex flex-col gap-10">
						<span className="flex gap-8 items-center">
							<span className="flex flex-col gap-2 ml-[200px]">
								<div className="flex items-center gap-2">
									<H2 className="font-funnel-sans">{business.name}</H2>
									{(business.verification === "Official" || business.verification === "Paid") && (
										<VerifiedIcon className="h-6 w-6 text-chernobyl" />
									)}
								</div>

								<B1 className="!text-lightgrey font-medium">
									@{business.name?.replace(/\s+/g, "").toLowerCase()}
								</B1>
							</span>
						</span>

						<B1>{business.description}</B1>

						<span className="flex flex-row gap-4 text-lightgrey">
							<B1 className="flex gap-2 items-center">
								<span className="text-white font-semibold">{stats.followers}</span>
								{stats.followers === 1 ? "seguidor" : "seguidores"}
							</B1>

							<B1 className="flex gap-2 items-center">
								<span className="text-white font-semibold">{stats.petitions}</span>
								peticiones activas
							</B1>

							<B1 className="flex gap-2 items-center">
								<span className="text-white font-semibold">{stats.offers}</span>
								ofertas activas
							</B1>
						</span>
					</div>

					<div className="flex flex-col gap-12 mt-8 w-1/3">
						<FollowButton
							variant="switch"
							followedByUser={isFollowing}
							entityId={business.id}
							entityType="Business"
							currentUserId={currentUserUuid}
							clientTranslations={clientTranslations}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-8">
					<div className="flex flex-col gap-6 w-full">
						<H2 className="text-2xl font-bold">Peticiones.</H2>
						{initialPosts.petitions.length > 0 ? (
							<InfinitePostGrid
								className="grid-cols-1 w-full gap-4"
								loadMoreAction={loadMoreBusinessPetitions.bind(null, id)}
								pageSize={10}
								maxPosts={50}
								maxColumns={1}
								initialPosts={initialPosts.petitions}
							/>
						) : (
							<div className="p-8 text-center border border-hover rounded-xl bg-hover/20">
								<B1 className="text-lightgrey">No hay peticiones activas</B1>
							</div>
						)}
					</div>

					<div className="flex flex-col gap-6 w-full">
						<H2 className="text-2xl font-bold">Ofertas.</H2>
						{initialPosts.offers.length > 0 ? (
							<InfinitePostGrid
								className="grid-cols-1 w-full gap-4"
								loadMoreAction={loadMoreBusinessOffers.bind(null, id)}
								pageSize={10}
								maxPosts={50}
								maxColumns={1}
								initialPosts={initialPosts.offers}
								userUuid={currentUserUuid}
							/>
						) : (
							<div className="p-8 text-center border border-hover rounded-xl bg-hover/20">
								<B1 className="text-lightgrey">No hay ofertas activas</B1>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-col gap-8 w-2/5">
				<div className="flex flex-col gap-4 p-6 rounded-xl sticky top-4">
					<span className="text-lightgrey text-sm font-medium">Foros de la empresa</span>
					<div className="flex flex-col gap-3">
						{businessForums.length > 0 ? (
							businessForums.map((forum) => (
								<ForumCard
									key={forum.id}
									forum={forum}
									currentUserId={currentUserUuid}
									clientTranslations={clientTranslations}
								/>
							))
						) : (
							<B1 className="text-lightgrey text-sm">No hay foros disponibles.</B1>
						)}
					</div>

					<Separator />

					<span className="text-lightgrey text-sm font-medium">Empresas similares</span>
					<div className="flex flex-col gap-3">
						{similarBusinesses.length > 0 ? (
							similarBusinesses.map((simBusiness) => (
								<BusinessCardHorizontalSmall key={simBusiness.id} business={simBusiness} />
							))
						) : (
							<B1 className="text-lightgrey text-sm">No se encontraron empresas similares.</B1>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

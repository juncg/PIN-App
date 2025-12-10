import { FollowButton } from "@/components/buttons/follow-button";
import { SidebarForumCard } from "@/components/cards/sidebar-forum-card";
import { InfinitePostGrid } from "@/components/posts/infinite-post-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Button } from "@/components/ui-custom/button";
import { B1, H1, H2, H5DisplayBold } from "@/components/ui-custom/typography";
import { Verified } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { BusinessProfileServices, loadMoreBusinessOffers, loadMoreBusinessPetitions } from "./page-services";
import { ISearchParams } from "@/types";
import { getUserUuid } from "@/lib/services/user";
import { IBusiness } from "@/lib/services/types";
import { VerifiedIcon } from "@/components/icons/icons";

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

	const SidebarBusinessCard = ({ business }: { business: IBusiness }) => (
		<Link
			href={`/business/${business.id}`}
			className="flex items-center gap-3 rounded-xl border border-hover bg-black p-3 hover:bg-hover hover:border-hover/20 transition-all"
		>
			<Avatar
				className={`h-10 w-10 rounded-lg border border-hover ${!business.profile_picture && "bg-lightgrey"}`}
			>
				<AvatarImage src={business.profile_picture || "/placeholder.png"} className="object-cover" />
				<AvatarFallback className="rounded-lg bg-transparent text-white font-bold">
					{business.name?.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col overflow-hidden">
				<span className="font-medium text-sm text-white truncate">{business.name}</span>
				<div className="flex items-center gap-1">
					<span className="text-xs text-lightgrey truncate">{business.followers} seguidores</span>
					{business.verification === "Official" && <Verified className="w-3 h-3 text-green-500" />}
				</div>
			</div>
		</Link>
	);

	return (
		<div className="container mx-auto max-w-[1600px] px-4 md:px-6 py-6 transition-all duration-300">
			<div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8">
				{/* Main Column */}
				<div className="flex flex-col gap-8 w-full">
					{/* Header Section */}
					<div className="relative w-full mb-8">
						{/* Banner */}
						<figure className="relative w-full h-[200px] rounded-xl overflow-hidden">
							<Image
								src={business.banner || "/placeholder.png"}
								alt="Business banner"
								fill
								className="object-cover"
								unoptimized
							/>
						</figure>

						{/* Profile Info Overlaying Banner/Below */}
						<div className="px-4 relative flex flex-col md:flex-row gap-6 items-start">
							<figure className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-[4px] border-darkmode -mt-[60px] shrink-0 bg-darkmode">
								<Image
									src={business.profile_picture || "/placeholder.png"}
									alt="Business profile picture"
									fill
									className="object-cover"
									unoptimized
								/>
							</figure>

							<div className="flex flex-col gap-4 w-full mt-4">
								<div className="flex flex-col md:flex-row justify-between items-start gap-4">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<H2 className="font-bold text-3xl">{business.name}</H2>
										</div>
										<div className="flex items-center gap-2 text-lightgrey">
											<B1 className="font-medium">
												@{business.name?.replace(/\s+/g, "").toLowerCase()}
											</B1>
											{(business.verification === "Official" ||
												business.verification === "Paid") && (
												<VerifiedIcon className="h-4 w-4 text-chernobyl" />
											)}
										</div>
									</div>

									{/* Action Button */}
									<FollowButton
										variant="switch"
										followedByUser={isFollowing}
										entityId={business.id}
										entityType="Business"
										currentUserId={currentUserUuid}
										clientTranslations={clientTranslations}
									/>
								</div>

								<B1 className="max-w-2xl">{business.description}</B1>

								<div className="flex gap-6 text-sm">
									<span className="flex gap-1 items-center">
										<strong className="text-white">{stats.followers}</strong>{" "}
										<span className="text-lightgrey">seguidores</span>
									</span>
									<span className="flex gap-1 items-center">
										<strong className="text-white">{stats.petitions}</strong>{" "}
										<span className="text-lightgrey">peticiones activas</span>
									</span>
									<span className="flex gap-1 items-center">
										<strong className="text-white">{stats.offers}</strong>{" "}
										<span className="text-lightgrey">ofertas activas</span>
									</span>
								</div>
							</div>
						</div>
					</div>

					{/* Feed Grid (Petitions & Offers) */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
						{/* Petitions Column */}
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

						{/* Offers Column */}
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

				{/* Right Sidebar */}
				<div className="flex flex-col gap-8 w-full">
					{/* Foros de la empresa */}
					<div className="flex flex-col gap-4 p-6 rounded-xl bg-cards border border-hover sticky top-4">
						<span className="text-lightgrey text-sm font-medium">Foros de la empresa</span>
						<div className="flex flex-col gap-3">
							{businessForums.length > 0 ? (
								businessForums.map((forum) => <SidebarForumCard key={forum.id} forum={forum} />)
							) : (
								<B1 className="text-lightgrey text-sm">No hay foros disponibles.</B1>
							)}
						</div>

						<div className="my-2 border-t border-hover/50"></div>

						{/* Empresas similares */}
						<span className="text-lightgrey text-sm font-medium">Empresas similares</span>
						<div className="flex flex-col gap-3">
							{similarBusinesses.length > 0 ? (
								similarBusinesses.map((simBusiness) => (
									<SidebarBusinessCard key={simBusiness.id} business={simBusiness} />
								))
							) : (
								<B1 className="text-lightgrey text-sm">No se encontraron empresas similares.</B1>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

import { FollowButton } from "@/components/buttons/follow-button";
import { ForumCardHorizontalSmall } from "@/components/cards/forum-card-horizontal-small";
import { InfinitePostGrid } from "@/components/posts/infinite-post-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { Button } from "@/components/ui-custom/button";
import { B1, H1, H2 } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { Verified } from "lucide-react";
import Image from "next/image";
import { ForumDetailsService, fetchForumPosts, loadMoreOffers, loadMorePetitions } from "./page-services";

interface ForumPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function ForumPage({ params, searchParams }: ForumPageProps) {
	const { id } = await params;
	const userUuid = await getUserUuid();
	const {
		forum,
		isFollowing,
		counts,
		categories,
		popularForums,
		businessForums,
		randomForums,
		translator,
		clientTranslations,
	} = await ForumDetailsService(id, searchParams);

	if (!forum || forum.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<H1>Foro no encontrado</H1>
				<B1>El foro que buscas no existe o ha sido eliminado.</B1>
			</div>
		);
	}

	const forumData = forum[0];
	const { offers: initialOffers, petitions: initialPetitions } = await fetchForumPosts(id, 0, 10);

	const bannerImage = forumData.banner || "/placeholder.png";
	const profileImage = forumData.profile_picture || "/placeholder.png";

	return (
		<div className="container mx-auto max-w-[1800px] px-4 md:px-6 py-6">
			<div className="grid grid-cols-1 lg:grid-cols-[20%_60%_20%] gap-6 lg:gap-8">
				{/* Left Sidebar */}
				<div className="hidden lg:block space-y-6">
					<div className="flex flex-wrap gap-2">
						<Button variant="outline" size="sm" className="rounded-full px-4">
							Todo
						</Button>
						{categories.map((category) => (
							<Button key={category.id} variant="outline" size="sm" className="rounded-full px-4">
								{category.name}
							</Button>
						))}
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-white">Recomendado para ti.</h3>
						<div className="space-y-3">
							{randomForums.map((forum) => (
								<ForumCardHorizontalSmall key={forum.id} forum={forum} />
							))}
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="font-semibold text-white">Lo más popular.</h3>
						<div className="space-y-3">
							{popularForums.map((forum) => (
								<ForumCardHorizontalSmall key={forum.id} forum={forum} />
							))}
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className="space-y-8">
					{/* Forum Header */}
					<div className="relative mb-8">
						<div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden">
							<Image
								src={bannerImage}
								alt={`${forumData.name} banner`}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>

						<div className="px-4 relative">
							<div className="flex flex-col md:flex-row gap-6 items-start">
								<div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-black -mt-12 md:-mt-16 bg-black shadow-lg shrink-0">
									<Image
										src={profileImage}
										alt={forumData.name || "Forum"}
										fill
										className="object-cover"
										unoptimized
									/>
								</div>

								<div className="flex-1 pt-4 space-y-4 w-full">
									<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
										<div>
											<div className="flex items-center gap-2">
												<H1 className="text-3xl font-bold">{forumData.name}</H1>
											</div>
											{forumData.Business && (
												<div className="flex items-center gap-1 text-lightgrey">
													<B1 className="font-medium">@{forumData.Business.name}</B1>
													{(forumData.Business.verification === "Official" ||
														forumData.Business.verification === "Paid") && (
														<Verified className="w-4 h-4 text-green-500" />
													)}
												</div>
											)}
										</div>

										<FollowButton
											followedByUser={isFollowing}
											entityId={forumData.id}
											entityType="Forum"
											currentUserId={userUuid}
											variant="switch"
											clientTranslations={clientTranslations}
										/>
									</div>

									{forumData.description && (
										<div>
											<B1 className="text-lightgrey text-sm leading-relaxed">
												{forumData.description}
											</B1>
										</div>
									)}

									<div className="flex items-center gap-6 text-sm font-medium">
										<div className="flex items-center gap-1">
											<span className="text-white font-bold">{forumData.followers || 0}</span>
											<span className="text-lightgrey">seguidores</span>
										</div>
										<div className="flex items-center gap-1">
											<span className="text-white font-bold">{counts.petitions}</span>
											<span className="text-lightgrey">peticiones activas</span>
										</div>
										<div className="flex items-center gap-1">
											<span className="text-white font-bold">{counts.offers}</span>
											<span className="text-lightgrey">ofertas activas</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Forum Posts Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-6">
							<H2 className="text-2xl font-bold">Peticiones.</H2>
							{initialPetitions.length > 0 ? (
								<InfinitePostGrid
									className="grid-cols-1 gap-6"
									loadMoreAction={loadMorePetitions.bind(null, id)}
									pageSize={10}
									maxPosts={50}
									maxColumns={1}
								/>
							) : (
								<div className="p-8 text-center">
									<B1 className="text-lightgrey">No hay peticiones activas</B1>
								</div>
							)}
						</div>

						<div className="space-y-6">
							<H2 className="text-2xl font-bold">Ofertas.</H2>
							{initialOffers.length > 0 ? (
								<InfinitePostGrid
									className="grid-cols-1 gap-6"
									loadMoreAction={loadMoreOffers.bind(null, id)}
									pageSize={10}
									maxPosts={50}
									maxColumns={1}
									userUuid={userUuid}
								/>
							) : (
								<div className="p-8 text-center">
									<B1 className="text-lightgrey">No hay ofertas activas</B1>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Right Sidebar */}
				<div className="hidden lg:block space-y-6">
					<div className="flex items-center gap-3 mb-6">
						<Avatar className="h-10 w-10 rounded-full">
							<AvatarImage
								src={forumData.Business?.profile_picture || "/placeholder.png"}
								alt={forumData.name || "Forum"}
								className="object-cover"
							/>
							<AvatarFallback className="bg-transparent text-white font-bold">
								{forumData.name?.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<span className="font-bold text-xl text-white">{forumData.Business?.name}</span>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-lightgrey">Más foros de la empresa.</h3>
						<div className="space-y-3">
							{businessForums.map((forum) => (
								<ForumCardHorizontalSmall key={forum.id} forum={forum} />
							))}
						</div>
					</div>

					<div className="space-y-3">
						<h3 className="text-sm font-medium text-lightgrey">Foros de productos similares.</h3>
						<div className="space-y-3"></div>
					</div>
				</div>
			</div>
		</div>
	);
}

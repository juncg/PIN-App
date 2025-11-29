import { InfinitePostList } from "@/components/posts/infinite-post-list";
import { H1, H2, P } from "@/components/ui-custom/typography";
import { Button } from "@/components/ui/button";
import { TPost } from "@/types";
import { ChevronRight, Verified } from "lucide-react";
import Image from "next/image";
import { ForumDetailsService, fetchForumPosts, loadMoreOffers, loadMorePetitions } from "./page-services";
import { FollowButton } from "@/components/buttons/follow-button";
import { getUserUuid } from "@/lib/services/user";
import Link from "next/link";

interface ForumPageProps {
	params: Promise<{
		id: number;
	}>;
}

export default async function ForumPage({ params }: ForumPageProps) {
	const { id } = await params;
	const userUuid = await getUserUuid();
	const { forum, isFollowing, counts } = await ForumDetailsService(id);
	const categories = [
		"Cuidado personal",
		"Moda y accesorios",
		"Juegos",
		"Viajes y hoteles",
		"Hogar y jardín",
		"Automoción y vehículos",
		"Deportes y ocio",
		"Tecnología",
	];

	if (!forum || forum.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full gap-4">
				<H1>Foro no encontrado</H1>
				<P>El foro que buscas no existe o ha sido eliminado.</P>
			</div>
		);
	}

	const forumData = forum[0];
	const tags = forumData.Forum_Tag?.map((ft) => ft.Tag.name).filter(Boolean) || [];
	const { offers: initialOffers, petitions: initialPetitions } = await fetchForumPosts(id, 0, 10);

	const bannerImage = forumData.banner || "/placeholder.png";
	const profileImage = forumData.profile_picture || "/placeholder.png";

	return (
		<div className="container mx-auto max-w-[1600px] px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
			{/* Left Sidebar */}
			<div className="hidden lg:block lg:col-span-3 space-y-6">
				<div className="flex items-center text-sm text-muted-foreground">
					<Link href="/forums" className="hover:text-foreground transition-colors">
						Foros
					</Link>
					<ChevronRight className="h-4 w-4 mx-1" />
					<span className="text-foreground font-medium">Foro</span>
				</div>

				<div className="flex flex-wrap gap-2">
					{categories.map((category) => {
						return (
							<Button
								key={category}
								variant="outline"
								size="sm"
								className="rounded-full px-4 hover:bg-accent hover:text-accent-foreground"
							>
								{category}
							</Button>
						);
					})}
				</div>

				<div className="space-y-3">
					<h3 className="font-semibold text-foreground">Recomendado para ti.</h3>
					<div className="space-y-3"></div>
				</div>

				<div className="space-y-3">
					<h3 className="font-semibold text-foreground">Lo más popular.</h3>
					<div className="space-y-3 opacity-50 pointer-events-none"></div>
				</div>
			</div>

			{/* Main Content */}
			<div className="col-span-1 lg:col-span-6 space-y-8">
				{/* Forum Header */}
				<div className="relative mb-8">
					{/* Banner */}
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
							{/* Profile Picture */}
							<div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-background -mt-12 md:-mt-16 bg-background shadow-lg shrink-0">
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
											<div className="flex items-center gap-1 text-muted-foreground">
												<P className="font-medium">@{forumData.Business.name}</P>
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
									/>
								</div>

								{forumData.description && (
									<div>
										<P className="text-muted-foreground text-sm leading-relaxed">
											{forumData.description}
										</P>
									</div>
								)}

								<div className="flex items-center gap-6 text-sm font-medium">
									<div className="flex items-center gap-1">
										<span className="text-foreground font-bold">{forumData.followers || 0}</span>
										<span className="text-muted-foreground">seguidores</span>
									</div>
									<div className="flex items-center gap-1">
										<span className="text-foreground font-bold">{counts.petitions}</span>
										<span className="text-muted-foreground">peticiones activas</span>
									</div>
									<div className="flex items-center gap-1">
										<span className="text-foreground font-bold">{counts.offers}</span>
										<span className="text-muted-foreground">ofertas activas</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Forum Posts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Petitions Column */}
					<div className="space-y-6">
						<H2 className="text-2xl font-bold">Peticiones.</H2>
						{initialPetitions.length > 0 ? (
							<InfinitePostList
								className="grid-cols-1 gap-6"
								initialPosts={initialPetitions as TPost[]}
								loadMoreAction={loadMorePetitions.bind(null, id)}
								pageSize={10}
								maxPosts={50}
							/>
						) : (
							<div className="p-8 text-center">
								<P className="text-muted-foreground">No hay peticiones activas</P>
							</div>
						)}
					</div>

					{/* Offers Column */}
					<div className="space-y-6">
						<H2 className="text-2xl font-bold">Ofertas.</H2>
						{initialOffers.length > 0 ? (
							<InfinitePostList
								className="grid-cols-1 gap-6"
								initialPosts={initialOffers as TPost[]}
								loadMoreAction={loadMoreOffers.bind(null, id)}
								pageSize={10}
								maxPosts={50}
							/>
						) : (
							<div className="p-8 text-center">
								<P className="text-muted-foreground">No hay ofertas activas</P>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Right Sidebar */}
			<div className="hidden lg:block lg:col-span-3 space-y-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
						<Image src="/placeholder.png" alt="Empresa" width={24} height={24} className="rounded-full" />
					</div>
					<div className="flex items-center gap-1.5">
						<span className="font-bold text-xl text-foreground">{forumData.Business?.name}</span>
					</div>
				</div>

				<div className="space-y-3">
					<h3 className="text-sm font-medium text-muted-foreground">Más foros de la empresa.</h3>
					<div className="space-y-3"></div>
				</div>

				<div className="space-y-3">
					<h3 className="text-sm font-medium text-muted-foreground">Foros de productos similares.</h3>
					<div className="space-y-3"></div>
				</div>
			</div>
		</div>
	);
}

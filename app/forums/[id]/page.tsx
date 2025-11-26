import { InfinitePostList } from "@/components/posts/infinite-post-list";
import { H1, H2, H3, P } from "@/components/ui-custom/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TPost } from "@/types";
import { Users, Verified } from "lucide-react";
import Image from "next/image";
import { ForumDetailsService, fetchForumPosts, loadMoreOffers, loadMorePetitions } from "./page-services";
import { FollowButton } from "@/components/buttons/follow-button";
import { getUserUuid } from "@/lib/services/user";

interface ForumPageProps {
	params: Promise<{
		id: number;
	}>;
}

export default async function ForumPage({ params }: ForumPageProps) {
	const { id } = await params;
	const userUuid = await getUserUuid();
	const { forum, isFollowing } = await ForumDetailsService(id);

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
		<div className="container mx-auto px-4 py-8">
			{/* Forum Header */}
			<Card className="mb-8 overflow-hidden">
				{/* Banner */}
				<div className="relative w-full h-48 md:h-64 bg-muted">
					<Image
						src={bannerImage}
						alt={`${forumData.name} banner`}
						fill
						className="object-cover"
						unoptimized
					/>
				</div>

				<div className="p-6">
					<div className="flex flex-col md:flex-row gap-6 items-start">
						{/* Profile Picture */}
						<div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-background -mt-12 md:-mt-16 bg-background shadow-lg">
							<Image
								src={profileImage}
								alt={forumData.name || "Forum"}
								fill
								className="object-cover"
								unoptimized
							/>
						</div>

						<div className="flex-1 space-y-4">
							<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
								<div>
									<div className="flex items-center gap-2 mb-2">
										<H1 className="text-3xl">{forumData.name}</H1>
										<Badge variant="outline">Foro</Badge>
									</div>
									{forumData.Business && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<P className="font-semibold">{forumData.Business.name}</P>
											{(forumData.Business.verification === "Official" ||
												forumData.Business.verification === "Paid") && (
												<Verified className="w-5 h-5" />
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

							<Separator />

							{forumData.description && (
								<div>
									<P className="text-muted-foreground">{forumData.description}</P>
								</div>
							)}

							<div className="flex items-center gap-4">
								<div className="flex items-center gap-2">
									<Users className="w-5 h-5 text-muted-foreground" />
									<P className="font-semibold">{forumData.followers || 0}</P>
									<P className="text-muted">seguidores</P>
								</div>
							</div>

							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{tags.map((tag, index) => (
										<Badge key={index} variant="secondary">
											{tag}
										</Badge>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</Card>

			{/* Forum Posts Section */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<H2>Publicaciones del Foro</H2>
				</div>

				<Separator />

				{/* Two Column Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Offers Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<H3>Ofertas</H3>
							<Badge>{initialOffers.length}</Badge>
						</div>
						<Separator />
						{initialOffers.length > 0 ? (
							<InfinitePostList
								className="!grid-cols-2"
								initialPosts={initialOffers as TPost[]}
								loadMoreAction={loadMoreOffers.bind(null, id)}
								pageSize={10}
								maxPosts={50}
							/>
						) : (
							<Card className="p-8 text-center">
								<P className="text-muted-foreground">No hay ofertas todavía</P>
							</Card>
						)}
					</div>

					{/* Petitions Column */}
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<H3>Peticiones</H3>
							<Badge>{initialPetitions.length}</Badge>
						</div>
						<Separator />
						{initialPetitions.length > 0 ? (
							<InfinitePostList
								className="!grid-cols-2"
								initialPosts={initialPetitions as TPost[]}
								loadMoreAction={loadMorePetitions.bind(null, id)}
								pageSize={10}
								maxPosts={50}
							/>
						) : (
							<Card className="p-8 text-center">
								<P className="text-muted-foreground">No hay peticiones todavía</P>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

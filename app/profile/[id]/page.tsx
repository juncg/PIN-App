import { PostCardHorizontal } from "@/components/cards/post-card-horizontal";
import { ProfileAltenatingButtons } from "@/components/profile/profile-alternating-buttons";
import { ProfileRightColumn } from "@/components/profile/profile-right-column";
import { Button } from "@/components/ui-custom/button";
import { H1, H2, H4, P } from "@/components/ui-custom/typography";
import { IOffer, IPetition } from "@/lib/services/types";
import { CalendarDays, MapPin, Users } from "lucide-react";
import Image from "next/image";
import { ProfileServices } from "./page-services";
import { ISearchParams } from "@/types";
import { GetJoinedDate } from "@/lib/services/utilities";

interface ProfilePageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function Profile({ params }: ProfilePageProps) {
	const { id } = await params;
	const {
		userData,
		followingForums,
		followingForumsCount,
		followingBusinesses,
		followingBusinessesCount,
		followingUsers,
		followingUsersCount,
		subscribedOffers,
		subscribedOffersCount,
		subscribedPetitions,
		subscribedPetitionsCount,
	} = await ProfileServices(id);

	return (
		<section className="flex flex-row justify-center items-start gap-16">
			<div className="flex flex-col gap-10 items-start w-full">
				<div className="flex gap-16 w-full">
					<div className="flex flex-col gap-10 w-2/3">
						<span className="flex gap-8 items-center">
							<figure className="relative w-[140px] h-[140px] rounded-full overflow-hidden">
								<Image
									src={userData?.profile_picture || "/placeholder.png"}
									alt={"User profile picture"}
									fill
									className="object-cover"
									unoptimized
								/>
							</figure>

							<span className="flex flex-col gap-2">
								<H1 className="font-funnel-sans">
									{userData?.name} {userData?.surnames}.
								</H1>

								<H4 className="text-muted-foreground">@{userData?.username}</H4>
							</span>
						</span>

						<P>{userData?.bio}</P>
					</div>

					<div className="flex flex-col gap-12 mt-8 w-1/3">
						<span className="flex flex-col gap-4 text-muted-foreground">
							<P className="flex gap-2 items-center">
								<MapPin className="!h-4" /> Ubicación: Ejemplo
							</P>
							<P className="flex gap-2 items-center">
								<Users className="!h-4" />
								Seguidores: {userData?.followers}
							</P>
							<P className="flex gap-2 items-center">
								<CalendarDays className="!h-4" />
								{GetJoinedDate(userData?.joined_at.toString() || "")}
							</P>
						</span>

						<span>
							<Button>Editar perfil</Button>
						</span>
					</div>
				</div>

				<ProfileAltenatingButtons
					subscriptionsContent={
						<>
							<div className="flex flex-col gap-12 w-full">
								<span className="flex items-end gap-6">
									<H2>Ofertas.</H2>
									<P className="text-muted-foreground line-clamp-2">
										{subscribedOffersCount} ofertas en total
									</P>
								</span>

								<div className="flex flex-col gap-8 w-full">
									{subscribedOffers.map((offer: IOffer) => {
										return <PostCardHorizontal key={offer.id} post={offer} />;
									})}
								</div>

								<div className="mx-auto">
									<Button>Mostrar más</Button>
								</div>
							</div>

							<div className="flex flex-col gap-12 w-full">
								<span className="flex items-end gap-6">
									<H2>Peticiones.</H2>
									<P className="text-muted-foreground line-clamp-2">
										{subscribedPetitionsCount} peticiones en total
									</P>
								</span>

								<div className="flex flex-col gap-8 w-full">
									{subscribedPetitions.map((petition: IPetition) => {
										return <PostCardHorizontal key={petition.id} post={petition} />;
									})}
								</div>

								<div className="mx-auto">
									<Button>Mostrar más</Button>
								</div>
							</div>
						</>
					}
					postsContent={
						<div>
							<H2>Mis publicaciones</H2>
							<P className="text-muted-foreground">Contenido de publicaciones aquí</P>
						</div>
					}
				/>
			</div>

			<ProfileRightColumn
				className="w-2/5"
				userData={userData}
				followingBusinesses={followingBusinesses}
				followingBusinessesTotalCount={followingBusinessesCount}
				followingForums={followingForums}
				followingForumsTotalCount={followingForumsCount}
				followingUsers={followingUsers}
				followingUsersTotalCount={followingUsersCount}
			/>
		</section>
	);
}

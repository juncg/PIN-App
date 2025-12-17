import EditProfileButton from "@/components/buttons/edit-profile-button";
import { FollowButton } from "@/components/buttons/follow-button";
import { AltenatingButtons, SlidingButtonProps } from "@/components/buttons/sliding-buttons";
import { CalendarIcon, CheckBoxIcon, LocationIcon, PeopleAlt2Icon, TextSnippetIcon } from "@/components/icons/icons";
import { ProfilePostsList } from "@/components/profile/profile-posts-list";
import { ProfileRightColumn } from "@/components/profile/profile-right-column";
import { ProfileSubscriptionsList } from "@/components/profile/profile-subscriptions-list";
import { B1, H2, H5DisplayBold } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { GetJoinedDate } from "@/lib/services/utilities";
import { ISearchParams } from "@/types";
import Image from "next/image";
import { ProfileServices, getUserPosts } from "./page-services";

interface ProfilePageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function Profile({ params, searchParams }: ProfilePageProps) {
	const { id } = await params;
	const {
		userData,
		followingForums,
		followingForumsCount,
		followingBusinesses,
		followingBusinessesCount,
		followingUsers,
		followingUsersCount,
		likedPostsCount,
		subscribedOffers,
		subscribedOffersCount,
		subscribedPetitions,
		subscribedPetitionsCount,
		followedByUser,
		clientTranslations,
		isBusinessUser,
	} = await ProfileServices(id, searchParams);

	// Get user's created posts
	const { offers, petitions, allPosts, offersCount, petitionsCount, totalCount } = await getUserPosts(id);

	const currentUserId = await getUserUuid();
	const isCurrentUser = currentUserId === userData?.id;

	const slidingButtonsContent: SlidingButtonProps[] = [
		{
			content: (
				<ProfileSubscriptionsList
					key="subscriptions"
					subscribedOffers={subscribedOffers}
					subscribedPetitions={subscribedPetitions}
					subscribedOffersCount={subscribedOffersCount}
					subscribedPetitionsCount={subscribedPetitionsCount}
					currentUserId={currentUserId}
				/>
			),
			displayName: isCurrentUser ? "Mis suscripciones" : "Suscripciones",
			displayIcon: <CheckBoxIcon />,
		},
		{
			content: (
				<ProfilePostsList
					key="posts"
					offers={offers}
					petitions={petitions}
					allPosts={allPosts}
					offersCount={offersCount}
					petitionsCount={petitionsCount}
					totalCount={totalCount}
					currentUserId={currentUserId}
				/>
			),
			displayName: isCurrentUser ? "Mis publicaciones" : "Publicaciones",
			displayIcon: <TextSnippetIcon />,
		},
	];

	return (
		<section className="flex flex-col lg:flex-row justify-center items-start gap-6 lg:gap-16 w-full px-2 sm:px-4 pb-12">
			<div className="flex flex-col gap-6 items-start w-full lg:w-3/5">
				<div className="relative w-full">
					<figure className="relative w-full h-[120px] xs:h-[160px] sm:h-[200px] rounded-b-lg overflow-hidden -mt-8">
						<Image
							src={userData?.banner || "/placeholder.png"}
							alt="Profile banner"
							fill
							className="object-cover"
							unoptimized
						/>
					</figure>

					<figure className="absolute -bottom-[60px] left-4 xs:left-8 w-[80px] h-[80px] xs:w-[120px] xs:h-[120px] sm:w-[140px] sm:h-[140px] rounded-full overflow-hidden border border-darkmode">
						<Image
							src={userData?.profile_picture || "/placeholder.png"}
							alt="User profile picture"
							fill
							className="object-cover"
							unoptimized
						/>
					</figure>
				</div>

				<div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full">
					<div className="flex flex-col gap-10">
						<span className="flex gap-8 items-center">
							<span className="flex flex-col gap-2 ml-[100px] sm:ml-[140px] md:ml-[200px]">
								<H2 className="font-funnel-sans">
									{userData?.name} {userData?.surnames}.
								</H2>

								<H5DisplayBold className="!text-lightgrey">@{userData?.username}</H5DisplayBold>
							</span>
						</span>

						<B1>{userData?.bio}</B1>

						<span className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-lightgrey">
							<B1 className="flex gap-2 items-center">
								<PeopleAlt2Icon className="!h-4" />
								{userData?.followers} {userData?.followers === 1 ? "seguidor" : "seguidores"}
							</B1>

							<B1 className="flex gap-2 items-center">
								<LocationIcon className="!h-4" />
								Ubicación: Ejemplo
							</B1>

							<B1 className="flex gap-2 items-center">
								<CalendarIcon className="!h-4" />
								{GetJoinedDate(userData?.joined_at.toString() || "")}
							</B1>
						</span>
					</div>

					<div className="flex flex-row md:flex-col gap-4 md:gap-12 mt-4 md:mt-8 w-full md:w-1/3">
						<span>
							{!isCurrentUser ? (
								<FollowButton
									variant="switch"
									followedByUser={followedByUser}
									entityId={id}
									entityType="User"
									currentUserId={currentUserId}
									clientTranslations={clientTranslations}
								/>
							) : (
								<EditProfileButton userData={userData} />
							)}
						</span>
					</div>
				</div>

				<AltenatingButtons buttonsContent={slidingButtonsContent} />
			</div>

			<ProfileRightColumn
				className="w-full lg:w-2/5 mt-8 lg:mt-0"
				userData={userData}
				followingBusinesses={followingBusinesses}
				followingBusinessesTotalCount={followingBusinessesCount}
				followingForums={followingForums}
				followingForumsTotalCount={followingForumsCount}
				followingUsers={followingUsers}
				followingUsersTotalCount={followingUsersCount}
				likedPostsCount={likedPostsCount}
				isCurrentUser={isCurrentUser}
				isBusinessUser={isBusinessUser}
			/>
		</section>
	);
}

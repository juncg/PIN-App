import { ProfileRightColumn } from "@/components/profile/profile-right-column";
import { Button } from "@/components/ui-custom/button";
import { H1, H2, H4, P } from "@/components/ui-custom/typography";
import { CalendarDays, MapPin, Newspaper, SquareCheckBigIcon, Users } from "lucide-react";
import Image from "next/image";
import { ProfileServices } from "./page-services";

export default async function Profile() {
	const {
		userData,
		followingForums,
		followingForumsCount,
		followingBusinesses,
		followingBusinessesCount,
		followingUsers,
		followingUsersCount,
	} = await ProfileServices();

	return (
		<section className="flex flex-row justify-center gap-16">
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
								Seguidores: 123456
							</P>
							<P className="flex gap-2 items-center">
								<CalendarDays className="!h-4" />
								Se unió en noviembre 2025
							</P>
						</span>

						<span>
							<Button>Editar perfil</Button>
						</span>
					</div>
				</div>

				<div className="flex w-full gap-4">
					<Button className="w-full">
						Mis suscripciones <SquareCheckBigIcon />
					</Button>
					<Button className="w-full">
						Mis publicaciones <Newspaper />
					</Button>
				</div>

				<div>
					<span>
						<H2>Ofertas.</H2>
						<P></P>
					</span>
				</div>
			</div>

			<ProfileRightColumn
				className="w-1/4"
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

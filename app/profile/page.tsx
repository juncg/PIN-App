import ProfileRight from "@/components/profile/profile-right";
import { H1, H2 } from "@/components/ui-custom/typography";
import Image from "next/image";
import { ProfileServices } from "./page-services";

export default async function Profile() {
	const { userData, companies } = await ProfileServices();

	return (
		<section className="flex flex-row justify-center gap-8">
			{/* Columna principal: perfil */}
			<div className="flex flex-col justify-center gap-8 w-2/3">
				<figure className="relative w-full h-48 overflow-hidden">
					<Image
						src={userData?.banner || "/placeholder.png"}
						alt={"User banner picture"}
						fill
						className="object-cover"
						unoptimized
					/>
				</figure>

				<div className="flex flex-col items-center gap-8">
					<H1>
						{userData?.name} {userData?.surnames} - ({userData?.username})
					</H1>

					<H2>{userData?.birth_date}</H2>

					<figure className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
						<Image
							src={userData?.profile_picture || "/placeholder.png"}
							alt={"User profile picture"}
							fill
							className="object-cover"
							unoptimized
						/>
					</figure>
				</div>
			</div>

			{/* Columna derecha: client component que gestiona estado de 'isBusiness' y el modal */}
			<ProfileRight className="w-1/3" userData={userData} companies={companies || []} />
		</section>
	);
}

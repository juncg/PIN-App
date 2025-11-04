import { H1, H2 } from "@/components/ui/typography";
import Image from "next/image";
import { ProfileServices } from "./page-services";

export default async function Profile() {
	const { user } = await ProfileServices();

	return (
		<section className="flex flex-col justify-center gap-8">
			<figure className="relative w-full h-48 overflow-hidden">
				<Image
					src={user?.[0].banner || "/placeholder.png"}
					alt={"User banner picture"}
					fill
					className="object-cover"
					unoptimized
				/>
			</figure>

			<div className="flex flex-col items-center gap-8">
				<H1>
					{user?.[0].name} {user?.[0].surnames} - ({user?.[0].username})
				</H1>

				<H2>{user?.[0].birth_date}</H2>

				<figure className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
					<Image
						src={user?.[0].profile_picture || "/placeholder.png"}
						alt={"User profile picture"}
						fill
						className="object-cover"
						unoptimized
					/>
				</figure>
			</div>
		</section>
	);
}

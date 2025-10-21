import { H1, H2 } from "@/components/ui/typography";
import { GetFromDatabase } from "@/lib/services/general";
import { IUser } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";
import Image from "next/image";

export default async function Home() {
	const uuid = await getUserUuid();
	const user = uuid ? await GetFromDatabase<IUser>({ tableName: "User", select: "*", eq: ["id", uuid] }) : [];

	return (
		<section className="flex flex-col justify-center gap-8">
			<figure className="relative w-full h-48 overflow-hidden">
				<Image
					src={user[0].banner || "/placeholder.png"}
					alt={"User banner picture"}
					fill
					className="object-cover"
				/>
			</figure>

			<div className="flex flex-col items-center gap-8">
				<H1>
					{user[0].name} {user[0].surnames} - ({user[0].username})
				</H1>

				<H2>{user[0].birth_date}</H2>

				<figure className="relative w-[200px] h-[200px] rounded-full overflow-hidden">
					<Image
						src={user[0].profile_picture || "/placeholder.png"}
						alt={"User profile picture"}
						fill
						className="object-cover"
					/>
				</figure>
			</div>
		</section>
	);
}

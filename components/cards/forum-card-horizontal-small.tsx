import { Avatar, AvatarImage } from "@/components/ui-custom/avatar";
import { IForum } from "@/lib/services/types";
import Link from "next/link";
import { VerifiedIcon } from "../icons/icons";
import { B1, B5 } from "../ui-custom/typography";

interface ForumCardHorizontalSmallProps {
	forum: IForum;
}

export function ForumCardHorizontalSmall({ forum }: ForumCardHorizontalSmallProps) {
	return (
		<Link
			href={`/forums/${forum.id}`}
			className="flex items-center gap-3 rounded-xl border border-cardborder bg-darkmode p-3 hover:bg-hover transition-all"
		>
			<Avatar className={`h-10 w-10 rounded-lg`}>
				<AvatarImage
					src={forum.profile_picture || "/placeholder.png"}
					alt={`${forum.name} business profile picture`}
					className="object-cover"
				/>
			</Avatar>

			<div className="flex flex-col overflow-hidden">
				<B1 className="truncate line-clamp-1">{forum.name}</B1>

				<div className="flex items-center gap-1">
					<B5 className="truncate line-clamp-1">@{forum.Business?.username}</B5>
					{forum.Business?.verification !== "Unverified" && (
						<VerifiedIcon className="h-4 w-4 text-chernobyl" />
					)}
				</div>
			</div>
		</Link>
	);
}

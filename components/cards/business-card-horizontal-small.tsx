import { VerifiedIcon } from "@/components/icons/icons";
import { IBusiness } from "@/lib/services/types";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui-custom/avatar";
import { B1, B5 } from "../ui-custom/typography";

interface BusinessCardHorizontalSmallProps {
	business: IBusiness;
}

export function BusinessCardHorizontalSmall({ business }: BusinessCardHorizontalSmallProps) {
	return (
		<Link
			href={`/business/${business.id}`}
			className="flex items-center gap-3 rounded-xl border-2 border-cardborder bg-darkmode p-3 hover:bg-hover transition-all"
		>
			<Avatar className={`h-10 w-10 rounded-lg`}>
				<AvatarImage
					src={business.profile_picture || "/placeholder.png"}
					alt={`${business.name} business profile picture`}
					className="object-cover"
				/>
			</Avatar>

			<div className="flex flex-col overflow-hidden">
				<B1 className="truncate line-clamp-1">{business.name}</B1>

				<div className="flex items-center gap-1">
					<B5 className="truncate line-clamp-1">@{business.username}</B5>
					{business.verification !== "Unverified" && <VerifiedIcon className="h-4 w-4 text-chernobyl" />}
				</div>
			</div>
		</Link>
	);
}

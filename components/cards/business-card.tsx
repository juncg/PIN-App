import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "../ui-custom/avatar";
import { IBusiness } from "@/lib/services/types";
import { VerifiedIcon } from "@/components/icons/icons";

interface SidebarBusinessCardProps {
	business: IBusiness;
}

export function SidebarBusinessCard({ business }: SidebarBusinessCardProps) {
	return (
		<Link
			href={`/business/${business.id}`}
			className="flex items-center gap-3 rounded-xl border border-hover bg-transparent p-3 hover:bg-hover hover:border-hover/20 transition-all"
		>
			<Avatar
				className={`h-10 w-10 rounded-lg border border-hover ${!business.profile_picture && "bg-lightgrey"}`}
			>
				<AvatarImage src={business.profile_picture || "/placeholder.png"} className="object-cover" />
				<AvatarFallback className="rounded-lg bg-transparent text-white font-bold">
					{business.name?.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col overflow-hidden">
				<span className="font-medium text-sm text-white truncate">{business.name}</span>
				<div className="flex items-center gap-1">
					<span className="text-xs text-lightgrey truncate">{business.followers} seguidores</span>
					{business.verification !== "Unverified" && <VerifiedIcon className="h-3 w-3 text-chernobyl" />}
				</div>
			</div>
		</Link>
	);
}

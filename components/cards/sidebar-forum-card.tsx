import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { IForum } from "@/lib/services/types";
import Link from "next/link";

interface SidebarForumCardProps {
	forum: IForum;
}

export function SidebarForumCard({ forum }: SidebarForumCardProps) {
	return (
		<Link
			href="#"
			className="flex items-center gap-3 rounded-xl border border-hover bg-black p-3 hover:bg-hover hover:border-hover/20 transition-all"
		>
			<Avatar className={`h-10 w-10 rounded-lg border border-hover ${!forum.profile_picture && "bg-muted"}`}>
				<AvatarImage src={forum.profile_picture || "/placeholder.png"} className="object-cover" />
				<AvatarFallback className="rounded-lg bg-transparent text-white font-bold">
					{forum.name?.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col overflow-hidden">
				<span className="font-medium text-sm text-white truncate">{forum.name}</span>
				<div className="flex items-center gap-1">
					<span className="text-xs text-muted truncate">{forum.Business?.name}</span>
				</div>
			</div>
		</Link>
	);
}

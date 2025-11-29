import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IForum } from "@/lib/services/types";

interface SidebarForumCardProps {
	forum: IForum;
}

export function SidebarForumCard({ forum }: SidebarForumCardProps) {
	return (
		<Link
			href="#"
			className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent hover:border-accent-foreground/20 transition-all"
		>
			<Avatar className={`h-10 w-10 rounded-lg border border-border ${!forum.profile_picture && "bg-muted"}`}>
				<AvatarImage src={forum.profile_picture || "/placeholder.png"} className="object-cover" />
				<AvatarFallback className="rounded-lg bg-transparent text-foreground font-bold">
					{forum.name?.charAt(0).toUpperCase()}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col overflow-hidden">
				<span className="font-medium text-sm text-foreground truncate">{forum.name}</span>
				<div className="flex items-center gap-1">
					<span className="text-xs text-muted-foreground truncate">{forum.Business?.name}</span>
				</div>
			</div>
		</Link>
	);
}

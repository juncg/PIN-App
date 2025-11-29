import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarForumCardProps {
	name: string;
	handle: string;
	isVerified?: boolean;
	image?: string;
	color?: string;
}

export function SidebarForumCard({ name, handle, isVerified, image, color = "bg-muted" }: SidebarForumCardProps) {
	return (
		<Link
			href="#"
			className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:bg-accent hover:border-accent-foreground/20 transition-all"
		>
			<Avatar className={`h-10 w-10 rounded-lg border border-border ${!image && color}`}>
				<AvatarImage src={image || "/placeholder.png"} className="object-cover" />
				<AvatarFallback className="rounded-lg bg-transparent text-foreground font-bold">
					{name[0]}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col overflow-hidden">
				<span className="font-medium text-sm text-foreground truncate">{name}</span>
				<div className="flex items-center gap-1">
					<span className="text-xs text-muted-foreground truncate">{handle}</span>
				</div>
			</div>
		</Link>
	);
}

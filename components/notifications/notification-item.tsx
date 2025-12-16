"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-custom/avatar";
import { INotification } from "@/lib/services/types";
import { Bell, Heart } from "lucide-react";
import Link from "next/link";
import { GetRelativeTime } from "@/lib/services/utilities";

interface NotificationItemProps {
	notification: INotification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
	return (
		<Link
			href={notification.link_to || "#"}
			className={`group relative flex items-start gap-4 px-4 py-3 transition-colors hover:bg-[var(--hover)] ${
				!notification.is_read ? "bg-[var(--chernobyl)]/5" : "bg-transparent"
			}`}
		>
			<div className="relative shrink-0">
				{notification.sender ? (
					<>
						<Avatar className="h-10 w-10 rounded-full border-none ring-1 ring-[var(--cardborder)]">
							<AvatarImage src={notification.sender.profile_picture || ""} className="object-cover" />
							<AvatarFallback className="text-xs bg-[var(--hover)] text-[var(--placeholder)]">
								{notification.sender.name?.[0]?.toUpperCase() || "U"}
							</AvatarFallback>
						</Avatar>
						{notification.type === "Like" && (
							<div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--destructive)] ring-2 ring-[var(--darkmode)]">
								<Heart className="h-2.5 w-2.5 text-white fill-white" />
							</div>
						)}
					</>
				) : (
					<div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--chernobyl)]/10 text-[var(--chernobyl)] border border-[var(--chernobyl)]/20">
						<Bell className="h-5 w-5" />
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0 flex flex-col pt-0.5">
				{notification.sender && (
					<span className="text-sm font-bold text-[var(--white)] leading-none mb-1">
						{notification.sender.username}
					</span>
				)}
				<p
					className={`text-sm leading-snug line-clamp-2 ${
						!notification.is_read ? "text-[var(--white)] font-medium" : "text-[var(--darkgrey)]"
					}`}
				>
					{notification.sender?.name || notification.sender?.username} {notification.message}
				</p>
				<span className="text-xs text-[var(--placeholder)] mt-1">
					{GetRelativeTime(notification.created_at)}
				</span>
			</div>

			{!notification.is_read && (
				<div className="shrink-0 pt-2">
					<div className="h-2 w-2 rounded-full bg-[var(--chernobyl)]" />
				</div>
			)}
		</Link>
	);
}

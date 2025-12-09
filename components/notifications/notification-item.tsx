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
			className={`group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
				!notification.is_read ? "bg-muted/20" : ""
			}`}
		>
			<div className="mt-1 shrink-0 relative">
				{notification.sender ? (
					<>
						<Avatar className="h-10 w-10 rounded-full">
							<AvatarImage src={notification.sender.profile_picture || ""} />
							<AvatarFallback>{notification.sender.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
						</Avatar>
						{notification.type === "Like" && (
							<div className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600">
								<Heart className="h-2.5 w-2.5 text-white fill-white" />
							</div>
						)}
					</>
				) : (
					<div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
						<Bell className="h-5 w-5" />
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0 flex flex-col gap-1">
				<p
					className={`text-sm leading-snug line-clamp-2 ${
						!notification.is_read ? "font-medium text-foreground" : "text-muted-foreground"
					}`}
				>
					{notification.sender ? notification.sender.name + " " + notification.message : notification.message}
				</p>
				<span className="text-xs text-muted-foreground/80">{GetRelativeTime(notification.created_at)}</span>
			</div>

			{!notification.is_read && <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
		</Link>
	);
}

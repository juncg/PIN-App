"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui-custom/dropdown-menu";
import { INotification } from "@/lib/services/types";
import { markAllAsRead } from "@/lib/services/notifications";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "../ui-custom/button";
import { NotificationItem } from "./notification-item";

interface NotificationsMenuProps {
	notifications: INotification[];
}

export function NotificationsMenu({ notifications }: NotificationsMenuProps) {
	const router = useRouter();

	const handleOpenChange = async (open: boolean) => {
		if (open) {
			const hasUnread = notifications.some((n) => !n.is_read);
			if (hasUnread) {
				await markAllAsRead();
				router.refresh();
			}
		}
	};

	return (
		<DropdownMenu onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button variant="default" size="icon" className="outline-none focus-visible:ring-0 relative">
					<Bell className="h-5 w-5" />
					{notifications.some((n) => !n.is_read) && (
						<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[400px] p-0 overflow-hidden">
				<div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
					<h4 className="font-semibold text-sm">Notificaciones</h4>
				</div>
				<div className="max-h-[500px] overflow-y-auto w-full">
					{notifications.length === 0 ? (
						<div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
							<Bell className="h-8 w-8 opacity-50" />
							<span>No tienes notificaciones</span>
						</div>
					) : (
						<div className="flex flex-col">
							{notifications.map((notification) => (
								<NotificationItem key={notification.id} notification={notification} />
							))}
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

"use client";

import { useState } from "react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui-custom/dropdown-menu";
import { markAllAsRead } from "@/lib/services/notifications";
import { INotification } from "@/lib/services/types";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui-custom/button";
import { NotificationItem } from "./notification-item";

import { useNewNotificationsIndicator } from "@/hooks/use-new-notification";

interface NotificationsMenuProps {
	notifications: INotification[];
	userId: string | null;
}

export function NotificationsMenu({ notifications, userId }: NotificationsMenuProps) {
	const router = useRouter();
	const hasNewNotification = useNewNotificationsIndicator(userId);
	const [filter, setFilter] = useState<"General" | "Offer" | "Petition">("General");

	const handleOpenChange = async (open: boolean) => {
		if (open) {
			const hasUnread = notifications.some((n) => !n.is_read);
			if (hasUnread) {
				await markAllAsRead();
				router.refresh();
			}
		}
	};

	const filteredNotifications = notifications.filter((n) => {
		if (filter === "General") return true;
		if (filter === "Offer") {
			return n.type === "Offer" || (n.link_to && n.link_to.includes("/offer"));
		}
		if (filter === "Petition") {
			return n.type === "Petition" || (n.link_to && n.link_to.includes("/petition"));
		}
		return true;
	});

	return (
		<DropdownMenu onOpenChange={handleOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button variant="default" size="icon" className="outline-none focus-visible:ring-0 relative">
					<Bell className="h-5 w-5" />
					{(notifications.some((n) => !n.is_read) || hasNewNotification) && (
						<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border border-darkmode" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="w-[400px] p-0 overflow-hidden bg-darkmode border border-cardborder rounded-2xl"
			>
				<div className="flex flex-col bg-hover/50">
					<div className="px-4 py-3 pb-2">
						<h4 className="font-semibold text-2xl text-white">Notificaciones.</h4>
					</div>
					<div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
						<Button
							variant={filter === "General" ? "default" : "outline"}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setFilter("General");
							}}
							size="sm"
						>
							General
						</Button>
						<Button
							variant={filter === "Offer" ? "default" : "outline"}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setFilter("Offer");
							}}
							size="sm"
						>
							Ofertas
						</Button>
						<Button
							variant={filter === "Petition" ? "default" : "outline"}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								setFilter("Petition");
							}}
							size="sm"
						>
							Peticiones
						</Button>
					</div>
				</div>
				<div
					className="max-h-[500px] overflow-y-auto w-full scrollbar-hide bg-darkmode"
					onWheel={(e) => e.stopPropagation()}
				>
					{filteredNotifications.length === 0 ? (
						<div className="p-8 text-center text-sm text-placeholder flex flex-col items-center gap-2">
							<Bell className="h-8 w-8 opacity-50" />
							<span>No hay notificaciones en esta categoría</span>
						</div>
					) : (
						<div className="flex flex-col">
							{filteredNotifications.map((notification) => (
								<NotificationItem key={notification.id} notification={notification} />
							))}
						</div>
					)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

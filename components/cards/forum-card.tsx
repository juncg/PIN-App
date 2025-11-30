"use client";

import { useUser } from "@/hooks/use-user";
import { IForum } from "@/lib/services/types";
import Link from "next/link";
import { FollowButton } from "../buttons/follow-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";

export interface IForumCard {
	className?: string;
	forum: IForum;
	currentUserId: string | null;
}

export function ForumCard({ className, forum, currentUserId }: IForumCard) {
	const { userUuid } = useUser();

	const followedByUser = forum.User_Forum?.some((u) => u.user_id === userUuid && u.forum_id === forum.id);

	return (
		<div className="rounded-xl border bg-black text-white p-6 flex flex-col justify-between h-full hover:border-muted transition-colors shadow-sm">
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12 border rounded-xl">
							<AvatarImage src={forum.profile_picture || "/placeholder.png"} />
							<AvatarFallback className="rounded-xl">{forum.name?.[0]}</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex flex-col items-start gap-0.5">
								<Link href={`/forums/${forum.id}`} className="text-s font-bold hover:underline">
									{forum.name}
								</Link>
								<span className="text-xs text-muted">{forum.Business?.name}</span>
							</div>
						</div>
					</div>
					<div className="text-right flex flex-col items-end gap-0.5">
						<span className="block font-bold">{forum.followers}</span>
						<span className="text-xs text-muted">seguidores</span>
					</div>
				</div>

				<p className="text-sm text-muted line-clamp-3 leading-relaxed">{forum.description}</p>
			</div>

			<div className="mt-6 flex items-end justify-between">
				<div className="space-y-1 text-sm">
					<div className="text-muted">
						<span className="font-medium">X peticiones</span>
					</div>
					<div className="text-muted">
						<span className="font-medium">X ofertas activas</span>
					</div>
				</div>
				<FollowButton
					entityId={forum.id}
					entityType="Forum"
					currentUserId={currentUserId}
					followedByUser={followedByUser || false}
					variant="switch"
				/>
			</div>
		</div>
	);
}

"use client";

import { useUser } from "@/hooks/use-user";
import { IForum } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FollowButton } from "../buttons/follow-button";
import { VerifiedIcon } from "../icons/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-custom/avatar";

export interface IForumCard {
	className?: string;
	forum: IForum;
	currentUserId: string | null;
}

export function ForumCard({ className, forum, currentUserId }: IForumCard) {
	const { userUuid } = useUser();

	const followedByUser = forum.User_Forum?.some((u) => u.user_id === userUuid && u.forum_id === forum.id);
	const activeOffersCount = forum.Offer?.length || 0;
	const petitionsCount = forum.Petition?.length || 0;

	return (
		<div
			className={cn(
				"rounded-xl border-[2px] border-cardborder bg-darkmode text-white p-6 flex flex-col justify-between h-full transition-colors shadow-sm",
				className
			)}
		>
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<div className="flex items-center gap-3">
						<Avatar className="h-12 w-12 rounded-xl">
							<AvatarImage src={forum.profile_picture || "/placeholder.png"} />
							<AvatarFallback className="rounded-xl">{forum.name?.[0]}</AvatarFallback>
						</Avatar>
						<div>
							<div className="flex flex-col items-start">
								<Link href={`/forums/${forum.id}`} className="text-s font-bold hover:underline">
									{forum.name}
								</Link>
								<div>
									<span className="text-xs text-lightgrey">{forum.Business?.name}</span>
									<div className="inline-block ml-1 text-lightgrey">
										{forum.Business?.verification != "Unverified" && (
											<VerifiedIcon className="inline-block w-3 h-3 text-chernobyl" />
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="text-right flex flex-col items-end gap-0.5">
						<span className="block font-bold">{forum.followers}</span>
						<span className="text-xs text-lightgrey">seguidores</span>
					</div>
				</div>

				<p className="text-sm text-lightgrey line-clamp-3 leading-relaxed">{forum.description}</p>
			</div>

			<div className="mt-6 flex items-end justify-between">
				<div className="space-y-1 text-sm">
					<div className="text-lightgrey">
						<span className="font-medium">{petitionsCount} peticiones</span>
					</div>
					<div className="text-lightgrey">
						<span className="font-medium">{activeOffersCount} ofertas activas</span>
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

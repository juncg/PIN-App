"use client";

import { IForum } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { H3, H4, P } from "../ui-custom/typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export interface IForumCard {
	className?: string;
	forum: IForum;
}

export function ForumCard(props: IForumCard) {
	const { forum, className } = props;

	const profileImage = forum.profile_picture || "/images/jancarlo.jpg";

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex items-center gap-4">
					<div className="relative w-16 h-16 overflow-hidden rounded-full flex-shrink-0 border-2 border-muted">
						<Image
							src={profileImage}
							alt={forum.name || "Forum"}
							fill
							className="object-cover"
							unoptimized
						/>
					</div>
					<div className="flex flex-col gap-1">
						<H3>{forum.name}</H3>
						<H4>{forum.businesses?.[0]?.business?.name}</H4>
					</div>
				</div>

				<Badge>Foro</Badge>
			</div>

			{forum.banner && (
				<div className="relative aspect-video w-full overflow-hidden rounded-md">
					<Image
						src={forum.banner}
						alt={`${forum.name} - banner`}
						fill
						className="object-cover"
						unoptimized
					/>
				</div>
			)}

			{forum.description && (
				<div className="flex flex-col gap-2">
					<P>{forum.description}</P>
				</div>
			)}

			<div className="flex items-center gap-2 text-muted-foreground">
				<Users className="w-4 h-4" />
				<P className="text-sm">{forum.followers || 0} seguidores</P>
			</div>

			<Separator />

			<div className="flex justify-between items-center">
				<Link href={`/forums/${forum.id}`}>
					<Button variant="default">Ver Foro</Button>
				</Link>
			</div>
		</article>
	);
}

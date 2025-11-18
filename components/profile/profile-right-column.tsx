"use client";

import { IBusiness, IForum, IUser } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { BadgeCheck, UserCircle } from "lucide-react";
import { AvatarGroup } from "../ui-custom/avatar-group";
import { Button } from "../ui-custom/button";
import { H3, P } from "../ui-custom/typography";
import Link from "next/link";

interface IProfileUserCompanyState {
	className?: string;
	userData?: IUser;
	followingForums?: IForum[];
	followingForumsTotalCount?: number;
	followingUsers?: IUser[];
	followingUsersTotalCount?: number;
	followingBusinesses?: IBusiness[];
	followingBusinessesTotalCount?: number;
	companies?: IBusiness[];
}

export function ProfileRightColumn(props: IProfileUserCompanyState) {
	const {
		className,
		userData,
		followingForums,
		followingForumsTotalCount,
		followingBusinesses,
		followingBusinessesTotalCount,
		followingUsers,
		followingUsersTotalCount,
	} = props;

	const isBusiness = (userData?.businesses?.length || 0) > 0;

	const forumsImages = [
		followingForums?.[0]?.profile_picture || "",
		followingForums?.[1]?.profile_picture || "",
		followingForums?.[2]?.profile_picture || "",
	];

	const businessesImages = [
		followingBusinesses?.[0]?.profile_picture || "",
		followingBusinesses?.[1]?.profile_picture || "",
		followingBusinesses?.[2]?.profile_picture || "",
	];

	const usersImages = [
		followingUsers?.[0]?.profile_picture || "",
		followingUsers?.[1]?.profile_picture || "",
		followingUsers?.[2]?.profile_picture || "",
	];

	return (
		<section className={cn("flex flex-col border-[2px] rounded-[20px] p-8 gap-12", className)}>
			<div className="flex flex-col gap-8">
				<H3>Mis follows</H3>

				<div className="flex justify-between">
					{followingForums && followingForums.length >= 0 && (
						<div className="flex flex-col gap-4">
							<AvatarGroup avatarImages={forumsImages} shape="Squared" inclined />
							<P className="text-muted-foreground">{followingForumsTotalCount} foros</P>
						</div>
					)}

					<div className="flex flex-col gap-4">
						<AvatarGroup avatarImages={businessesImages} />
						<P className="text-muted-foreground">{followingBusinessesTotalCount} empresas</P>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<AvatarGroup avatarImages={usersImages} />
					<P className="text-muted-foreground">{followingUsersTotalCount} usuarios</P>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<H3>Estado de la cuenta</H3>

				<div className="flex gap-2 text-muted-foreground items-center">
					<UserCircle className="h-4" />
					<P>{isBusiness ? "Usuario business" : "Usuario pobre"}</P>
				</div>
			</div>

			{!isBusiness && (
				<Link href="/upgrade-user">
					<Button>
						Registrar Empresa <BadgeCheck />
					</Button>
				</Link>
			)}
		</section>
	);
}

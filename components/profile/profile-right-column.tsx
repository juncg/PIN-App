"use client";

import { IBusiness, IForum, IUser } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
	AccountCircleIcon,
	CheckCircleIcon,
	FavoriteIcon,
	HistoryIcon,
	PackageIcon,
	PaymentIcon,
	SendIcon,
	Shining2FillIcon,
	VerifiedIcon,
	WalletIcon,
} from "../icons/icons";
import { AvatarGroup } from "../ui-custom/avatar-group";
import { Button } from "../ui-custom/button";
import { Separator } from "../ui-custom/separator";
import { B1, H4 } from "../ui-custom/typography";

interface IProfileUserCompanyState {
	className?: string;
	userData?: IUser;
	followingForums?: IForum[];
	followingForumsTotalCount?: number;
	followingUsers?: IUser[];
	followingUsersTotalCount?: number;
	followingBusinesses?: IBusiness[];
	followingBusinessesTotalCount?: number;
	likedPostsCount?: number;
	companies?: IBusiness[];
	isCurrentUser?: boolean;
	isBusinessUser?: boolean;
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
		likedPostsCount,
		isCurrentUser = false,
		isBusinessUser = false,
	} = props;

	const isBusiness = isBusinessUser;

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
		<section className={cn("flex flex-col border rounded-[20px] p-10 gap-12 border-cardborder", className)}>
			<div className="flex flex-col gap-8">
				<H4 className="font-funnel-sans">{isCurrentUser ? "Mis follows." : "Follows."}</H4>

				<div className="flex justify-between">
					{followingForums && followingForums.length >= 0 && (
						<div className="flex flex-col gap-4">
							<AvatarGroup avatarImages={forumsImages} shape="Squared" inclined />
							<B1 className="text-lightgrey">{followingForumsTotalCount} foros</B1>
						</div>
					)}

					<div className="flex flex-col gap-4">
						<AvatarGroup avatarImages={businessesImages} />
						<B1 className="text-lightgrey">{followingBusinessesTotalCount} empresas</B1>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<AvatarGroup avatarImages={usersImages} />
					<B1 className="text-lightgrey">{followingUsersTotalCount} usuarios</B1>
				</div>
			</div>

			<div className="-mx-10">
				<Separator className="!h-[2px] bg-cardborder" />
			</div>

			<div className="flex flex-col gap-8">
				<H4>{isCurrentUser ? "Mis favoritos." : "Favoritos."}</H4>

				<div className="flex gap-2 items-center justify-between">
					<div className="flex flex-col items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="hover:bg-transparent hover:text-white hover:scale-105 transition"
						>
							<FavoriteIcon className="!h-10 !w-10" />
						</Button>

						<B1>{likedPostsCount} posts</B1>
					</div>

					<div className="flex flex-col items-center gap-2">
						<Button variant="chernobylOutline">
							Hyper Like <Shining2FillIcon />
						</Button>

						<B1>¡Hypea tus posts favoritos!</B1>
					</div>
				</div>
			</div>

			{isCurrentUser && (
				<>
					<div className="-mx-10">
						<Separator className="!h-[2px] bg-cardborder" />
					</div>

					<div className="flex flex-col gap-8">
						<H4 className="font-funnel-sans">Mis pedidos.</H4>

						<div className="flex gap-8 justify-between">
							<Button
								className="!flex !flex-col gap-2 border-cardborder h-auto w-1/2 py-4 !rounded-2xl"
								size="lg"
								variant="outline"
							>
								<PaymentIcon className="!h-6 !w-6" />
								<B1 className="text-center">Pendientes de pago</B1>
							</Button>

							<Button
								className="!flex !flex-col gap-2 border-cardborder h-auto w-1/2 py-4 !rounded-2xl"
								size="lg"
								variant="outline"
							>
								<PackageIcon className="!h-6 !w-6" />
								<B1 className="text-center">Pendientes de envío</B1>
							</Button>
						</div>

						<div className="flex gap-8 justify-between">
							<Button
								className="!flex !flex-col gap-2 border-cardborder h-auto w-1/2 py-4 !rounded-2xl"
								size="lg"
								variant="outline"
							>
								<SendIcon className="!h-6 !w-6" />
								<B1 className="text-center">En proceso de envío</B1>
							</Button>

							<Button
								className="!flex !flex-col gap-2 border-cardborder h-auto w-1/2 py-4 !rounded-2xl"
								size="lg"
								variant="outline"
							>
								<CheckCircleIcon className="!h-6 !w-6" />
								<B1 className="text-center">Pedidos completados</B1>
							</Button>
						</div>
					</div>

					<div className="-mx-10">
						<Separator className="!h-[2px] bg-cardborder" />
					</div>
				</>
			)}

			{isCurrentUser && (
				<>
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-2">
							<H4>Estado de la cuenta.</H4>

							<div className="flex gap-2 text-lightgrey items-center">
								<AccountCircleIcon className="!h-5 !w-5" />
								<B1>{isBusiness ? "Usuario empresa" : "Usuario estándar"}</B1>
							</div>
						</div>

						{!isBusiness && (
							<Button variant="outline" className="rounded-lg">
								<Link href="/upgrade-user" className="flex items-center gap-2">
									Mejorar a Business <VerifiedIcon />
								</Link>
							</Button>
						)}
					</div>

					<div className="-mx-10">
						<Separator className="!h-[2px] bg-cardborder" />
					</div>
				</>
			)}

			{isCurrentUser && (
				<div className="flex flex-col gap-8">
					<H4 className="font-funnel-sans">Mis pagos.</H4>

					<div className="flex gap-8 justify-between">
						<Button
							className="!flex !flex-col gap-2 border-cardborder h-auto w-1/2 py-4 !rounded-2xl"
							size="lg"
							variant="outline"
						>
							<WalletIcon className="!h-6 !w-6" />
							<B1 className="text-center">Cuentas y tarjetas</B1>
						</Button>

						<Button
							className="!flex !flex-col gap-2 border-cardborder h-auto w-1/2 py-4 !rounded-2xl"
							size="lg"
							variant="outline"
						>
							<HistoryIcon className="!h-6 !w-6" />
							<B1 className="text-center">Historial de transacciones</B1>
						</Button>
					</div>
				</div>
			)}
		</section>
	);
}

"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui-custom/button";
import { LogoutButton } from "./logout-button";

interface AuthButtonsClientProps {
	className?: string;
	isAuthenticated?: boolean;
}

export function AuthButtonsClient({ className, isAuthenticated = false }: AuthButtonsClientProps) {
	return isAuthenticated ? (
		<div className={cn("flex items-center gap-4", className)}>
			<LogoutButton />
		</div>
	) : (
		<div className={cn("flex gap-2", className)}>
			<Button asChild variant="default">
				<Link href="/auth/login">Iniciar sesión.</Link>
			</Button>

			<Button asChild variant="outline">
				<Link href="/auth/sign-up">Crear cuenta.</Link>
			</Button>
		</div>
	);
}

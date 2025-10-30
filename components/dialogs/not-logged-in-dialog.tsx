"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

export function NotLoggedInDialog() {
	return (
		<Dialog defaultOpen>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Accede a tu cuenta</DialogTitle>
				</DialogHeader>
				<DialogFooter>
					<Link href="/auth/login">
						<Button>Iniciar sesión</Button>
					</Link>
					<Link href="/auth/sign-up">
						<Button>Registrarse</Button>
					</Link>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

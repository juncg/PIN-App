import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogoutButton } from "./logout-button";

export async function AuthButton() {
	const supabase = await createClient();
	const { data } = await supabase.auth.getClaims();
	const user = data?.claims;

	return user ? (
		<div className="flex items-center gap-4">
			Hola, {user.email}!
			<LogoutButton />
		</div>
	) : (
		<div className="flex gap-2">
			<Button asChild size="sm" variant={"outline"}>
				<Link href="/auth/login">Iniciar sesión</Link>
			</Button>

			<Button asChild size="sm" variant={"default"}>
				<Link href="/auth/sign-up">Crear cuenta</Link>
			</Button>
		</div>
	);
}

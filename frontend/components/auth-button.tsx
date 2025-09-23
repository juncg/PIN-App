import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { LogoutButton } from "./logout-button";
import { Button } from "./ui/button";

export async function AuthButton() {
	const supabase = await createClient();

	// You can also use getUser() which will be slower.
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

"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui-custom/button";

export function LogoutButton() {
	const logout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		window.location.href = "/auth/login";
	};

	return <Button onClick={logout}>Cerrar sesión.</Button>;
}

import { createClient } from "@/lib/supabase/server";
import { AuthButtonsClient } from "./auth-buttons";

interface AuthButtonsProps {
	className?: string;
}

export async function AuthButtons({ className }: AuthButtonsProps) {
	const supabase = await createClient();
	const { data } = await supabase.auth.getClaims();
	const user = data?.claims;

	return <AuthButtonsClient className={className} isAuthenticated={!!user} />;
}

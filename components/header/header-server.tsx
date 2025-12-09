import { getNotificationsForUser } from "@/lib/services/notifications";
import { getUserUuid } from "@/lib/services/user";
import { createClient } from "@/lib/supabase/server";
import { HeaderClient } from "./header";

export async function Header() {
	const { data: notifications } = await getNotificationsForUser();
	const userId = await getUserUuid();

	const supabase = await createClient();
	const { data } = await supabase.auth.getClaims();
	const isAuthenticated = !!data?.claims;

	return (
		<HeaderClient
			notifications={notifications || []}
			userId={userId ?? undefined}
			isAuthenticated={isAuthenticated}
		/>
	);
}

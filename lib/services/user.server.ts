import { createClient } from "@/lib/supabase/server";

/**
 * Gets the UUID of the currently authenticated user.
 * This function can only be used in Server Components or Server Actions.
 * @returns The user's UUID or null if not authenticated
 */
export async function getUserUuid(): Promise<string | null> {
	const supabase = await createClient();
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		console.error("Error getting user:", error);
		return null;
	}
	
	const user = data?.user;
	return user?.id || null;
}

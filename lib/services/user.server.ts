import { createClient } from "@/lib/supabase/server";

/**
 * Get the UUID of the currently authenticated user from the server
 * This should only be used in Server Components and Server Actions
 */
export async function getUserUuid(): Promise<string | null> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();
		return user?.id ?? null;
	} catch (error) {
		console.error("Error getting user UUID:", error);
		return null;
	}
}

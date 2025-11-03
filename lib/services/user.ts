import { GetClient } from "./general";

export async function IsUsernameAlreadyUsed(username: string): Promise<{ exists: boolean; error?: string }> {
	try {
		const { supabase } = await GetClient();
		const { data, error } = await supabase.from("User").select("username").eq("username", username);

		if (error) {
			console.error("Error fetching user:", error);
			return { exists: false, error: error.message };
		}

		return { exists: data.length > 0 };
	} catch (error) {
		console.error("Unexpected error:", error);
		return {
			exists: false,
			error: error instanceof Error ? error.message : "Error inesperado",
		};
	}
}

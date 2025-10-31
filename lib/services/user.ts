import { Tables } from "@/database.types";
import { GetClient } from "./general";

const { supabase } = GetClient();

export type UserType = Tables<"User">;

export async function CreateUser(userData: UserType): Promise<{ success: boolean; error?: string }> {
	try {
		const { error } = await supabase.from("User").insert([userData]);

		if (error) {
			console.error("Error inserting student:", error);
			return { success: false, error: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Unexpected error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Error inesperado",
		};
	}
}

export async function IsUsernameAlreadyUsed(username: string): Promise<{ exists: boolean; error?: string }> {
	try {
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

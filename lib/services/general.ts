import { createClient } from "@supabase/supabase-js";

export function GetClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "URL no encontrada";
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "Key no encontrada";
	const supabase = createClient(supabaseUrl, supabaseKey);

	return { supabase };
}

const { supabase } = GetClient();

export async function GetFromDatabase<T = unknown>(tableName: string, select: string): Promise<T[]> {
	const { data: entries, error } = await supabase.from(tableName).select(select);

	if (error) {
		console.error(`Error fetching ${tableName}:`, error);
	}

	return (entries as T[]) || [];
}

export async function PostToDatabase<T = unknown>(tableName: string, select: string): Promise<T[]> {
	const { data: entries, error } = await supabase.from(tableName).select(select);

	if (error) {
		console.error(`Error fetching ${tableName}:`, error);
	}

	return (entries as T[]) || [];
}

export async function PutToDatabase<T = unknown>(tableName: string, select: string): Promise<T[]> {
	const { data: entries, error } = await supabase.from(tableName).select(select);

	if (error) {
		console.error(`Error fetching ${tableName}:`, error);
	}

	return (entries as T[]) || [];
}

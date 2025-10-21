import { createClient } from "@supabase/supabase-js";
import { IDeleteToDatabase, IGetFromDatabase, IPostToDatabase, IPutToDatabase } from "./types";

export function GetClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "URL no encontrada";
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "Key no encontrada";
	const supabase = createClient(supabaseUrl, supabaseKey);

	return { supabase };
}

const { supabase } = GetClient();

export async function GetFromDatabase<T = unknown>({ tableName, select, eq }: IGetFromDatabase): Promise<T[]> {
	let query = supabase.from(tableName).select(select);
	
	if (eq) {
		query = query.eq(eq[0], eq[1]);
	}
	
	const { data: entries, error } = await query;

	if (error) {
		console.error(`Error fetching ${tableName}:`, error);
	}

	return (entries as T[]) || [];
}

export async function PostToDatabase<T = unknown>({ tableName, contentJson }: IPostToDatabase<T>): Promise<T[]> {
	const { data, error } = await supabase.from(tableName).insert(contentJson).select();

	if (error) {
		console.error(`Error inserting into ${tableName}:`, error);
		return [];
	}

	return (data as T[]) || [];
}

export async function PutToDatabase<T = unknown>({
	tableName,
	contentJson,
	matchColumn,
	matchValue,
}: IPutToDatabase<T>): Promise<T[]> {
	const { data, error } = await supabase.from(tableName).update(contentJson).eq(matchColumn, matchValue).select();

	if (error) {
		console.error(`Error updating ${tableName}:`, error);
		return [];
	}

	return (data as T[]) || [];
}

export async function DeleteFromDatabase<T = unknown>({
	tableName,
	matchColumn,
	matchValue,
}: IDeleteToDatabase): Promise<T[]> {
	const { error } = await supabase.from(tableName).delete().eq(matchColumn, matchValue);

	if (error) {
		console.error(`Error deleting from ${tableName}:`, error);
		return [];
	}

	return [];
}

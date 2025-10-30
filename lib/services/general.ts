/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, PostgrestError } from "@supabase/supabase-js";

export function GetClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "URL no encontrada";
	const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "Key no encontrada";
	const supabase = createClient(supabaseUrl, supabaseKey);

	return { supabase };
}

const { supabase } = GetClient();

type SupabaseGenericFilter =
	| {
			method:
				| "eq"
				| "gt"
				| "lt"
				| "gte"
				| "lte"
				| "like"
				| "ilike"
				| "is"
				| "in"
				| "neq"
				| "contains"
				| "containedBy"
				| "not"
				| "or"
				| "order"
				| "range"
				| "single"
				| "limit"
				| "rangeFrom"
				| "rangeTo";
			column?: string;
			value?: any;
			operator?: string;
			ascending?: boolean;
			nullsFirst?: boolean;
			from?: number;
			to?: number;
	  }
	| { method: "or"; value: string };

function applySupabaseFilter(query: any, filter: SupabaseGenericFilter) {
	switch (filter.method) {
		case "eq":
		case "gt":
		case "lt":
		case "gte":
		case "lte":
		case "like":
		case "ilike":
		case "is":
		case "in":
		case "neq":
			return query[filter.method](filter.column, filter.value);
		case "contains":
		case "containedBy":
			return query[filter.method](filter.column, filter.value);
		case "not":
			return query.not(filter.column, filter.operator, filter.value);
		case "or":
			return query.or(filter.value);
		case "order":
			return query.order(filter.column!, { ascending: filter.ascending ?? true, nullsFirst: filter.nullsFirst });
		case "range":
			return query.range(filter.from!, filter.to!);
		case "rangeFrom":
			return query.range(filter.from!, undefined);
		case "rangeTo":
			return query.range(undefined, filter.to!);
		case "single":
			return query.single();
		case "limit":
			return query.limit(filter.value);
		default:
			return query;
	}
}

export type SupabaseApiResult<T = unknown> = {
	data: T[] | null;
	error: PostgrestError | null;
};

export async function GetFromDatabase<T = unknown>({
	tableName,
	select = "*",
	filters = [],
}: {
	tableName: string;
	select?: string;
	filters?: SupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	let query = supabase.from(tableName).select(select);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data: entries, error } = await query;

	return { data: (entries as T[]) || null, error: error ?? null };
}

export async function PostToDatabase<T = unknown>({
	tableName,
	contentJson,
	filters = [],
}: {
	tableName: string;
	contentJson: Partial<T> | Partial<T>[];
	filters?: SupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	let query = supabase.from(tableName).insert(contentJson).select();

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query;

	return { data: (data as T[]) || null, error: error ?? null };
}

export async function PutToDatabase<T = unknown>({
	tableName,
	contentJson,
	filters = [],
}: {
	tableName: string;
	contentJson: Partial<T>;
	filters?: SupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	let query = supabase.from(tableName).update(contentJson);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query.select();

	return { data: (data as T[]) || null, error: error ?? null };
}

export async function DeleteFromDatabase<T = unknown>({
	tableName,
	matchColumn,
	matchValue,
	filters = [],
}: {
	tableName: string;
	matchColumn: string;
	matchValue: any;
	filters?: SupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	let query = supabase.from(tableName).delete().eq(matchColumn, matchValue);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query;

	return { data: (data as unknown as T[]) || null, error: error ?? null };
}

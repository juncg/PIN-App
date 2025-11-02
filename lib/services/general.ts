/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient as createServerClient } from "@/lib/supabase/server";
import { PostgrestError, createClient } from "@supabase/supabase-js";

// This function should be used for authenticated operations
// It uses the SSR client that has access to user sessions
export async function GetClient() {
	const supabase = await createServerClient();
	return { supabase };
}

// Service client for admin operations that bypass RLS
// IMPORTANT: This should only be used for operations that need to bypass RLS
// For example: counting subscribers, administrative tasks, etc.
export async function GetServiceClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

	const supabase = createClient(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	});

	return { supabase };
}

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
	const { supabase } = await GetClient();
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
	const { supabase } = await GetClient();
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
	const { supabase } = await GetClient();
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
	const { supabase } = await GetClient();
	let query = supabase.from(tableName).delete().eq(matchColumn, matchValue);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query;

	return { data: (data as unknown as T[]) || null, error: error ?? null };
}

export async function ExecuteRpcFunction<T = unknown>({
	functionName,
	params = {},
}: {
	functionName: string;
	params?: Record<string, any>;
}): Promise<SupabaseApiResult<T>> {
	const { supabase: serviceSupabase } = await GetClient();
	const { data, error } = await serviceSupabase.rpc(functionName, params);
	return { data: (data as T[]) || null, error: error ?? null };
}

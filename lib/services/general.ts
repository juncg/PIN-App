"use server";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient as createServerClient } from "@/lib/supabase/server";
import { PostgrestError, createClient } from "@supabase/supabase-js";
import { DEBUG } from "../constants";
import { ISupabaseGenericFilter } from "./types";

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

function applySupabaseFilter(query: any, filter: ISupabaseGenericFilter) {
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
	skipRLS = false,
}: {
	tableName: string;
	select?: string;
	filters?: ISupabaseGenericFilter[];
	skipRLS?: boolean;
}): Promise<SupabaseApiResult<T>> {
	const { supabase } = await (skipRLS ? GetServiceClient() : GetClient());
	let query = supabase.from(tableName).select(select);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data: entries, error } = await query;

	if (DEBUG && error) {
		console.error(
			`GET request failed: ${error}\n Request made to ${tableName} with select = ${select} and filters = ${filters}`
		);
	}

	return { data: (entries as T[]) || null, error: error ?? null };
}

export async function PostToDatabase<T = unknown>({
	tableName,
	contentJson,
	filters = [],
}: {
	tableName: string;
	contentJson: Partial<T> | Partial<T>[];
	filters?: ISupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	const { supabase } = await GetClient();
	let query = supabase.from(tableName).insert(contentJson).select();

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query;

	if (DEBUG && error) {
		console.error(
			`POST request failed: ${error}\n Request made to ${tableName} with contentJson = ${contentJson} and filters = ${filters}`
		);
	}

	return { data: (data as T[]) || null, error: error ?? null };
}

export async function PutToDatabase<T = unknown>({
	tableName,
	contentJson,
	filters = [],
}: {
	tableName: string;
	contentJson: Partial<T>;
	filters?: ISupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	const { supabase } = await GetClient();
	let query = supabase.from(tableName).update(contentJson);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query.select();

	if (DEBUG && error) {
		console.error(
			`PUT request failed: ${error}\n Request made to ${tableName} with contentJson = ${contentJson} and filters = ${filters}`
		);
	}

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
	filters?: ISupabaseGenericFilter[];
}): Promise<SupabaseApiResult<T>> {
	const { supabase } = await GetClient();
	let query = supabase.from(tableName).delete().eq(matchColumn, matchValue);

	filters.forEach((filter) => {
		query = applySupabaseFilter(query, filter);
	});

	const { data, error } = await query;

	if (DEBUG && error) {
		console.error(
			`DELETE request failed: ${error}\n Request made to ${tableName} with matchColumn = ${matchColumn}, matchValue = ${matchValue} and filters = ${filters}`
		);
	}

	return { data: (data as unknown as T[]) || null, error: error ?? null };
}

export async function ExecuteRpcFunction<T = unknown>({
	functionName,
	params = {},
}: {
	functionName: string;
	params?: Record<string, any>;
}): Promise<SupabaseApiResult<T>> {
	const { supabase } = await GetServiceClient();
	const { data, error } = await supabase.rpc(functionName, params);

	if (DEBUG && error) {
		console.error(`RPC function failed: ${error}\n Function name = ${functionName} with params = ${params}`);
	}

	return { data: (data as T[]) || null, error: error ?? null };
}

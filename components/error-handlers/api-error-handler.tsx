"use client";
import { PostgrestError } from "@supabase/supabase-js";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";

export function APIErrorHandler({ error }: { error: PostgrestError | null }) {
	if (error) {
		if (error.code === "42501") {
			return <NotLoggedInDialog />;
		}
	}
}

"use client";
import { PostgrestError } from "@supabase/supabase-js";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";

export function APIErrorHandler(error: PostgrestError) {
	console.log("oi mate, can i have a ciggy, mate");
	if (error.code === "42501") {
		return <NotLoggedInDialog />;
	}
}

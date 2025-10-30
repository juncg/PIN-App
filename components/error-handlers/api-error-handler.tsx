"use client";
import { PostgrestError } from "@supabase/supabase-js";
import { useEffect } from "react";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";

export function APIErrorHandler({ error }: { error: PostgrestError | null }) {
	useEffect(() => {
		if (error && error.code !== "42501") {
			window.location.href = "/error";
		}
	}, [error]);

	if (error) {
		if (error.code === "42501") {
			return <NotLoggedInDialog />;
		}
	}

	return null;
}

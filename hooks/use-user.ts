"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useUser() {
	const [userUuid, setUserUuid] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		const getUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			setUserUuid(user?.id ?? null);
			setIsLoading(false);
		};

		getUser();

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			setUserUuid(session?.user?.id ?? null);
		});

		return () => {
			subscription.unsubscribe();
		};
	}, []);

	return { userUuid, isLoading };
}

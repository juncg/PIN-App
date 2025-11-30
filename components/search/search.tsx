"use client";

import { Input } from "@/components/ui-custom/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function SearchInput() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("postName") ?? "");
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setSearchQuery(value);

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			const params = new URLSearchParams(Array.from(searchParams.entries()));

			if (value) {
				params.set("postName", value);
			} else {
				params.delete("postName");
			}

			router.replace(`?${params.toString()}`);
		}, 500);
	}

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	return (
		<div className="space-y-6">
			<div className="relative max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />

				<Input
					placeholder={`Búsqueda por nombre...`}
					value={searchQuery}
					onChange={handleChange}
					className="pl-10 glass"
				/>
			</div>
		</div>
	);
}

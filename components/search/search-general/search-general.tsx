"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui-custom/input";
import { SearchGeneralDropdown } from "./search-general-dropdown";

export function SearchGeneral() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") ?? "");
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
				params.set("search", value);
			} else {
				params.delete("search");
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
		<div className="absolute left-1/2 -translate-x-1/2">
			<div className="relative">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
				<Input
					type="search"
					placeholder="Buscar..."
					className="pl-9 w-96"
					onChange={handleChange}
					value={searchQuery}
				/>

				<SearchGeneralDropdown />
			</div>
		</div>
	);
}

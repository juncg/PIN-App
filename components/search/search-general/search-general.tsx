"use client";

import { SearchIcon } from "@/components/icons/icons";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../../ui-custom/input";
import { SearchGeneralDropdown } from "./search-general-dropdown";

export function SearchGeneral() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") ?? "");
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setSearchQuery(value);
		setIsOpen(true);

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
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, []);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className="absolute left-1/2 -translate-x-1/2" ref={containerRef}>
			<div className="relative">
				<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />

				<Input
					type="search"
					placeholder="Buscar..."
					className="pl-9 pr-9 w-96 border border-cardborder"
					onChange={handleChange}
					value={searchQuery}
					onFocus={() => searchQuery && setIsOpen(true)}
				/>

				{searchQuery && (
					<button
						type="button"
						onClick={() => setSearchQuery("")}
						className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 focus:outline-none"
						tabIndex={-1}
						aria-label="Limpiar búsqueda"
						style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
					>
						<X className="h-4 w-4" />
					</button>
				)}

				<SearchGeneralDropdown isOpen={isOpen} onClose={handleClose} />
			</div>
		</div>
	);
}

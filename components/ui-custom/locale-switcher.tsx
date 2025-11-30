"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui-custom/dropdown-menu";
import { Globe } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui-custom/button";

const locales = [
	{ code: "en", label: "English" },
	{ code: "es", label: "Español" },
];

export function LocaleSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const currentLocale = searchParams.get("locale") || "en";

	const handleLocaleChange = (newLocale: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("locale", newLocale);

		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="default" size="icon" className="outline-none focus-visible:ring-0">
					<Globe />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuRadioGroup value={currentLocale} onValueChange={handleLocaleChange}>
					{locales.map((locale) => (
						<DropdownMenuRadioItem key={locale.code} value={locale.code}>
							{locale.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

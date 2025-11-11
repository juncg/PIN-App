"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface OrderSelectProps {
	translations: {
		sort_by: string;
		newest: string;
		oldest: string;
		price_low_high: string;
		price_high_low: string;
		rating_low_high: string;
		rating_high_low: string;
	};
	defaultValue?: string;
}

export function OrderSelect({ translations, defaultValue = "newest" }: OrderSelectProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const handleValueChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("orderBy", value);
		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<Select onValueChange={handleValueChange} defaultValue={defaultValue}>
			<SelectTrigger className="w-auto min-w-[180px] max-w-[300px]">
				<SelectValue placeholder={translations.sort_by} />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="newest">{translations.newest}</SelectItem>
				<SelectItem value="oldest">{translations.oldest}</SelectItem>
				<SelectItem value="price_low_high">{translations.price_low_high}</SelectItem>
				<SelectItem value="price_high_low">{translations.price_high_low}</SelectItem>
				<SelectItem value="rating_low_high">{translations.rating_low_high}</SelectItem>
				<SelectItem value="rating_high_low">{translations.rating_high_low}</SelectItem>
			</SelectContent>
		</Select>
	);
}

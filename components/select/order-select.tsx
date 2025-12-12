"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-custom/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface OrderSelectProps {
	options: {
		value: string;
		label: string;
	}[];
	placeholder: string;
	defaultValue?: string;
}

export function OrderSelect({ options, placeholder, defaultValue = "newest" }: OrderSelectProps) {
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
			<SelectTrigger className="w-auto max-w-[300px]">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

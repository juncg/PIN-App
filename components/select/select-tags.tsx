"use client";

import type { Option } from "@/components/ui/multi-select";
import MultipleSelector from "@/components/ui/multi-select";
import { cn } from "@/lib/utils";

interface SelectTagsProps {
	className?: string;
	availableTags: { id: number; name: string }[];
	selectedTags: number[];
	onTagsChange: (tagIds: number[]) => void;
	label?: string;
	placeholder?: string;
	disabled?: boolean;
}

export function SelectTags({
	className,
	availableTags,
	selectedTags,
	onTagsChange,
	placeholder = "Selecciona tags",
	disabled = false,
}: SelectTagsProps) {
	const tagOptions: Option[] = availableTags.map((tag) => ({
		value: tag.id.toString(),
		label: tag.name,
	}));

	const selectedOptions: Option[] = availableTags
		.filter((tag) => selectedTags.includes(tag.id))
		.map((tag) => ({
			value: tag.id.toString(),
			label: tag.name,
		}));

	const handleChange = (options: Option[]) => {
		const tagIds = options.map((option) => parseInt(option.value));
		onTagsChange(tagIds);
	};

	return (
		<div className={cn("w-full space-y-2", className)}>
			<MultipleSelector
				commandProps={{
					filter: (value, search) => {
						if (!search) return 1;
						const label = tagOptions.find((opt) => opt.value === value)?.label || "";
						return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
					},
				}}
				value={selectedOptions}
				onChange={handleChange}
				defaultOptions={tagOptions}
				placeholder={placeholder}
				disabled={disabled}
				hideClearAllButton={false}
				hidePlaceholderWhenSelected
				emptyIndicator={<p className="text-center text-sm">No se encontraron tags</p>}
				className="w-full"
			/>
		</div>
	);
}

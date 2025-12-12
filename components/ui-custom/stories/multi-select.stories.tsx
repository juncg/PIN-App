import { useState } from "react";
import MultipleSelector, { type Option } from "../multi-select";

export default {
	title: "UI/MultiSelect",
	component: MultipleSelector,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

const OPTIONS: Option[] = [
	{ value: "apple", label: "Apple" },
	{ value: "banana", label: "Banana" },
	{ value: "blueberry", label: "Blueberry" },
	{ value: "grapes", label: "Grapes" },
	{ value: "pineapple", label: "Pineapple" },
];

export const Default = {
	render: () => {
		const [selected, setSelected] = useState<Option[]>([]);
		return (
			<MultipleSelector
				value={selected}
				onChange={setSelected}
				defaultOptions={OPTIONS}
				placeholder="Select fruits..."
				emptyIndicator={
					<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">no results found.</p>
				}
			/>
		);
	},
};

export const WithGroups = {
	render: () => {
		const [selected, setSelected] = useState<Option[]>([]);
		const GROUPED_OPTIONS: Option[] = [
			{ value: "apple", label: "Apple", group: "Fruits" },
			{ value: "banana", label: "Banana", group: "Fruits" },
			{ value: "carrot", label: "Carrot", group: "Vegetables" },
			{ value: "broccoli", label: "Broccoli", group: "Vegetables" },
		];
		return (
			<MultipleSelector
				value={selected}
				onChange={setSelected}
				defaultOptions={GROUPED_OPTIONS}
				groupBy="group"
				placeholder="Select items..."
			/>
		);
	},
};

export const Creatable = {
	render: () => {
		const [selected, setSelected] = useState<Option[]>([]);
		return (
			<MultipleSelector
				value={selected}
				onChange={setSelected}
				defaultOptions={OPTIONS}
				placeholder="Select or create fruits..."
				creatable
			/>
		);
	},
};

export const MaxSelected = {
	render: () => {
		const [selected, setSelected] = useState<Option[]>([]);
		return (
			<MultipleSelector
				value={selected}
				onChange={setSelected}
				defaultOptions={OPTIONS}
				placeholder="Select up to 3 fruits..."
				maxSelected={3}
				onMaxSelected={(maxLimit) => {
					alert(`You can only select up to ${maxLimit} items`);
				}}
			/>
		);
	},
};

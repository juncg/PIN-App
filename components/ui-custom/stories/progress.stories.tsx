import { Progress } from "../progress";

export default {
	title: "UI/Progress",
	component: Progress,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	args: {
		value: 50,
	},
};

export const Full = {
	args: {
		value: 100,
	},
};

export const Empty = {
	args: {
		value: 0,
	},
};

import { Separator } from "../separator";

export default {
	title: "UI/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Horizontal = {
	render: () => (
		<div className="space-y-2">
			<p>Above separator</p>
			<Separator />
			<p>Below separator</p>
		</div>
	),
};

export const Vertical = {
	render: () => (
		<div className="flex h-10 items-center space-x-2">
			<p>Left</p>
			<Separator orientation="vertical" />
			<p>Right</p>
		</div>
	),
};

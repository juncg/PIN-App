import { Label } from "../label";

export default {
	title: "UI/Label",
	component: Label,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => <Label>Label text</Label>,
};

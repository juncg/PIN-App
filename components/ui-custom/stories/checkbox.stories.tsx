import { useState } from "react";
import { Checkbox } from "../checkbox";

export default {
	title: "UI/Checkbox",
	component: Checkbox,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => {
		const [checked, setChecked] = useState(false);
		return <Checkbox checked={checked} onCheckedChange={(value) => setChecked(value === true)} />;
	},
};

export const Checked = {
	render: () => <Checkbox defaultChecked />,
};

export const Disabled = {
	render: () => <Checkbox disabled />,
};

export const DisabledChecked = {
	render: () => <Checkbox disabled defaultChecked />,
};

export const WithLabel = {
	render: () => {
		const [checked, setChecked] = useState(false);
		return (
			<div className="flex items-center space-x-2">
				<Checkbox id="terms" checked={checked} onCheckedChange={(value) => setChecked(value === true)} />
				<label
					htmlFor="terms"
					className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Accept terms and conditions
				</label>
			</div>
		);
	},
};

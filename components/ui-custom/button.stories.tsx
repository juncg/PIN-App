import type { Meta, StoryObj } from "@storybook/react";
import { DealBuyLogoIcon } from "../icons/icons";
import { Button } from "./button";

const meta = {
	title: "UI/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"defaultSquared",
				"outline",
				"outlineSquared",
				"ghost",
				"ghostSquared",
				"chernobyl",
				"chernobylSquared",
				"chernobylOutline",
				"chernobylOutlineSquared",
				"destructive",
				"destructiveSquared",
			],
		},
		size: {
			control: "select",
			options: ["default", "sm", "lg", "icon"],
		},
		disabled: {
			control: "boolean",
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "Button",
		variant: "default",
		size: "default",
	},
};

export const DefaultSquared: Story = {
	args: {
		children: "Button",
		variant: "defaultSquared",
		size: "default",
	},
};

export const Outline: Story = {
	args: {
		children: "Button",
		variant: "outline",
		size: "default",
	},
};

export const OutlineSquared: Story = {
	args: {
		children: "Button",
		variant: "outlineSquared",
		size: "default",
	},
};

export const Ghost: Story = {
	args: {
		children: "Button",
		variant: "ghost",
		size: "default",
	},
};

export const GhostSquared: Story = {
	args: {
		children: "Button",
		variant: "ghostSquared",
		size: "default",
	},
};

export const Chernobyl: Story = {
	args: {
		children: "Button",
		variant: "chernobyl",
		size: "default",
	},
};

export const ChernobylSquared: Story = {
	args: {
		children: "Button",
		variant: "chernobylSquared",
		size: "default",
	},
};

export const ChernobylOutline: Story = {
	args: {
		children: "Button",
		variant: "chernobylOutline",
		size: "default",
	},
};

export const ChernobylOutlineSquared: Story = {
	args: {
		children: "Button",
		variant: "chernobylOutlineSquared",
		size: "default",
	},
};

export const Destructive: Story = {
	args: {
		children: "Delete",
		variant: "destructive",
		size: "default",
	},
};

export const DestructiveSquared: Story = {
	args: {
		children: "Delete",
		variant: "destructiveSquared",
		size: "default",
	},
};

export const Small: Story = {
	args: {
		children: "Small Button",
		size: "sm",
	},
};

export const Large: Story = {
	args: {
		children: "Large Button",
		size: "lg",
	},
};

export const Icon: Story = {
	args: {
		children: <DealBuyLogoIcon />,
		size: "icon",
	},
};

export const Disabled: Story = {
	args: {
		children: "Disabled",
		disabled: true,
	},
};

export const DisabledOutline: Story = {
	args: {
		children: "Disabled Outline",
		variant: "outline",
		disabled: true,
	},
};

import type { Meta, StoryObj } from "@storybook/react";
import { ScrollArea, ScrollBar } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
	title: "UI/ScrollArea",
	component: ScrollArea,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const sampleContent = Array.from({ length: 50 }, (_, i) => (
	<div key={i} className="p-4 border-b border-gray-200">
		Item {i + 1}: This is a sample item in the scrollable area. Lorem ipsum dolor sit amet, consectetur adipiscing
		elit.
	</div>
));

export const Default: Story = {
	render: () => (
		<ScrollArea className="h-64 w-80">
			<div className="p-4">{sampleContent}</div>
		</ScrollArea>
	),
};

export const Horizontal: Story = {
	render: () => (
		<ScrollArea className="h-32 w-80 rounded-md border">
			<div className="flex space-x-4 p-4" style={{ width: "1000px" }}>
				{Array.from({ length: 20 }, (_, i) => (
					<div
						key={i}
						className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded flex items-center justify-center"
					>
						Item {i + 1}
					</div>
				))}
			</div>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	),
};

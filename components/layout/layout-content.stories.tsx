import { HeaderClient } from "@/components/header/header";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { SidebarProvider } from "@/components/ui-custom/sidebar";
import type { Meta, StoryObj } from "@storybook/react";

const meta = {
	title: "Layout/Sidebar and Header",
	component: LayoutStory,
	parameters: {
		layout: "fullscreen",
		nextjs: {
			appDirectory: true,
			navigation: {
				pathname: "/home",
			},
		},
	},
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className="min-h-screen w-full">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof LayoutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

function LayoutStory() {
	return (
		<SidebarProvider>
			<div className="flex flex-col min-h-screen w-full">
				<HeaderClient notifications={[]} />

				<AppSidebar />
			</div>
		</SidebarProvider>
	);
}

export const Default: Story = {};

import { Button } from "../button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";

export default {
	title: "UI/Tooltip",
	component: Tooltip,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">Hover me</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>This is a tooltip</p>
			</TooltipContent>
		</Tooltip>
	),
};

export const WithSide = {
	render: () => (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button variant="outline">Hover me</Button>
			</TooltipTrigger>
			<TooltipContent side="right">
				<p>Tooltip on the right</p>
			</TooltipContent>
		</Tooltip>
	),
};

export const WithDelay = {
	render: () => (
		<Tooltip delayDuration={500}>
			<TooltipTrigger asChild>
				<Button variant="outline">Hover me (delayed)</Button>
			</TooltipTrigger>
			<TooltipContent>
				<p>This tooltip appears after 500ms</p>
			</TooltipContent>
		</Tooltip>
	),
};

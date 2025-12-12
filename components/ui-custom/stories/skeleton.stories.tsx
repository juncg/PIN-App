import { Skeleton } from "../skeleton";

export default {
	title: "UI/Skeleton",
	component: Skeleton,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => <Skeleton className="h-4 w-20" />,
};

export const Circle = {
	render: () => <Skeleton className="h-10 w-10 rounded-full" />,
};

export const Rectangle = {
	render: () => <Skeleton className="h-20 w-32" />,
};

import Image from "next/image";
import { Button } from "../button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../card";
import { B1 } from "../typography";

export default {
	title: "UI/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => (
		<Card className="w-80">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>Card description goes here.</CardDescription>
			</CardHeader>
			<CardContent>
				<B1>This is the main content of the card.</B1>
			</CardContent>
			<CardFooter>
				<Button>Action</Button>
			</CardFooter>
		</Card>
	),
};

export const WithImage = {
	render: () => (
		<Card className="w-80">
			<CardHeader>
				<Image
					src="/placeholder.png"
					alt="Card image"
					width={200}
					height={100}
					className="w-full h-32 object-cover rounded-t-xl"
				/>
				<CardTitle>Image Card</CardTitle>
				<CardDescription>A card with an image.</CardDescription>
			</CardHeader>
			<CardContent>
				<B1>Content below the image.</B1>
			</CardContent>
		</Card>
	),
};

export const Compact = {
	render: () => (
		<Card className="w-64">
			<CardContent className="p-4">
				<CardTitle className="text-lg">Compact Card</CardTitle>
				<CardDescription className="text-sm">Smaller padding and size.</CardDescription>
			</CardContent>
		</Card>
	),
};

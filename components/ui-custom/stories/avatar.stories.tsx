import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export default {
	title: "UI/Avatar",
	component: Avatar,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const WithImage = {
	render: () => (
		<Avatar>
			<AvatarImage src="/jancarlo.jpg" alt="User" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

export const WithFallback = {
	render: () => (
		<Avatar>
			<AvatarImage src="" alt="User" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

export const WithIconFallback = {
	render: () => (
		<Avatar>
			<AvatarImage src="" alt="User" />
			<AvatarFallback>
				<User className="size-4" />
			</AvatarFallback>
		</Avatar>
	),
};

export const Large = {
	render: () => (
		<Avatar className="size-12">
			<AvatarImage src="/jancarlo.jpg" alt="User" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

export const Small = {
	render: () => (
		<Avatar className="size-6">
			<AvatarImage src="/jancarlo.jpg" alt="User" />
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>
	),
};

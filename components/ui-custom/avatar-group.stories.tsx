import { AvatarGroup } from "./avatar-group";

export default {
	title: "UI/AvatarGroup",
	component: AvatarGroup,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	args: {
		avatarImages: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
		shape: "Rounded",
		inclined: false,
	},
};

export const Squared = {
	args: {
		avatarImages: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
		shape: "Squared",
		inclined: false,
	},
};

export const Inclined = {
	args: {
		avatarImages: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
		shape: "Rounded",
		inclined: true,
	},
};

export const SquaredInclined = {
	args: {
		avatarImages: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
		shape: "Squared",
		inclined: true,
	},
};

export const WithRealImages = {
	args: {
		avatarImages: ["/jancarlo.jpg", "/jancarlo.jpg", "/jancarlo.jpg"],
		shape: "Rounded",
		inclined: false,
	},
};

export const EmptyImages = {
	args: {
		avatarImages: [],
		shape: "Rounded",
		inclined: false,
	},
};

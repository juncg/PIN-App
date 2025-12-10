import { ForumCardHorizontalSmall } from "./forum-card-horizontal-small";

export default {
	title: "Cards/ForumCardHorizontalSmall",
	component: ForumCardHorizontalSmall,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

const mockForum: any = {
	id: "1",
	name: "Tech Discussions",
	profile_picture: "/placeholder.png",
	Business: {
		name: "Tech Corp",
		username: "TechCorp",
		verification: "Official",
	},
};

const mockForumUnverified: any = {
	id: "2",
	name: "Tech Discussions",
	profile_picture: "/placeholder.png",
	Business: {
		name: "Tech Corp",
		username: "TechCorp",
		verification: "Unverified",
	},
};

export const Default = {
	args: {
		forum: mockForum,
	},
};

export const Unverified = {
	args: {
		forum: mockForumUnverified,
	},
};

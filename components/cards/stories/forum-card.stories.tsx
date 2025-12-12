import { ForumCard } from "../forum-card";

export default {
	title: "Cards/ForumCard",
	component: ForumCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

const mockForum: any = {
	id: "1",
	name: "Tech Discussions",
	description:
		"A forum for discussing the latest in technology, from AI to web development. Join the conversation and share your insights.",
	profile_picture: "/placeholder.png",
	followers: 1234,
	Business: {
		name: "Tech Corp",
		verification: "Verified",
	},
	User_Forum: [],
	Offer: [{}, {}, {}], // 3 offers
	Petition: [{}, {}, {}, {}], // 4 petitions
};

const mockForumUnverified: any = {
	...mockForum,
	Business: {
		name: "Startup Inc",
		verification: "Unverified",
	},
};

export const Default = {
	args: {
		forum: mockForum,
		currentUserId: "user1",
		clientTranslations: {},
	},
};

export const UnverifiedBusiness = {
	args: {
		forum: mockForumUnverified,
		currentUserId: "user1",
		clientTranslations: {},
	},
};

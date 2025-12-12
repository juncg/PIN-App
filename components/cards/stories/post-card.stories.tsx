import { PostCard } from "../post-card";

export default {
	title: "Cards/PostCard",
	component: PostCard,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

const mockUser = {
	id: "1",
	username: "johndoe",
	profile_picture: "/placeholder.png",
};

const mockOffer: any = {
	id: 1,
	type: "Offer",
	title: "Amazing Product Deal",
	text: "Get this incredible product at a discounted price. Limited time offer!",
	images: ["/placeholder.png"],
	current_progress: 25,
	target_progress: 200,
	target_completition_date: new Date(Date.now() + 86400000).toISOString(),
	creator_id: "1",
	likes: 25,
	businesses: [
		{
			business: {
				name: "Tech Corp",
				profile_picture: "/placeholder.png",
			},
		},
	],
	User: mockUser,
	User_Offer: [],
};

const mockPetition: any = {
	id: 2,
	type: "Petition",
	title: "Support Our Cause",
	text: "We need your support to make this change happen. Sign the petition today!",
	images: ["/placeholder.png"],
	current_progress: 100,
	target_progress: 1000,
	creator_id: "1",
	likes: 100,
	businesses: [
		{
			business: {
				name: "Nonprofit Org",
				profile_picture: "/placeholder.png",
			},
		},
	],
	User: mockUser,
	User_Petition: [],
};

export const Offer = {
	args: {
		post: mockOffer,
		userUuidProp: "user1",
	},
};

export const Petition = {
	args: {
		post: mockPetition,
		userUuidProp: "user1",
	},
};

export const OfferOnFire = {
	args: {
		post: {
			...mockOffer,
			current_progress: 180, // 90% completion
		},
		userUuidProp: "user1",
	},
};

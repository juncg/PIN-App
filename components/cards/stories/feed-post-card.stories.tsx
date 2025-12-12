import { FeedPostCard } from "../feed-post-card";

export default {
	title: "Cards/FeedPostCard",
	component: FeedPostCard,
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
	reduced_price: 50,
	products: [
		{
			Product: {
				msrp: 100,
			},
		},
	],
	User: mockUser,
	User_Offer: [],
	comment_count: 5,
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
	User: mockUser,
	User_Petition: [],
	comment_count: 10,
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

export const OfferWithMultipleImages = {
	args: {
		post: {
			...mockOffer,
			images: ["/placeholder.png", "/placeholder.png"],
		},
		userUuidProp: "user1",
	},
};

export const PetitionLiked = {
	args: {
		post: mockPetition,
		userUuidProp: "user1",
		likedByUser: true,
	},
};

import { PostCardHorizontal } from "../post-card-horizontal";

export default {
	title: "Cards/PostCardHorizontal",
	component: PostCardHorizontal,
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
	current_progress: 150,
	target_progress: 200,
	target_completition_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
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
};

const mockPetition: any = {
	id: 2,
	type: "Petition",
	title: "Support Our Cause",
	text: "We need your support to make this change happen. Sign the petition today!",
	images: ["/placeholder.png"],
	current_progress: 500,
	target_progress: 1000,
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

export const OfferCompleted = {
	args: {
		post: {
			...mockOffer,
			current_progress: 200,
			target_completition_date: new Date(Date.now() - 86400000).toISOString(), // yesterday
		},
		userUuidProp: "user1",
	},
};

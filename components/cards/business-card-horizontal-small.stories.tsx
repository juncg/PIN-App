import { BusinessCardHorizontalSmall } from "./business-card-horizontal-small";

export default {
	title: "Cards/BusinessCardHorizontalSmall",
	component: BusinessCardHorizontalSmall,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

const mockBusiness = {
	id: "1",
	name: "Tech Solutions Inc.",
	profile_picture: "/placeholder.png",
	username: "TechSolutionsInc",
	verification: "Verified",
};

const mockBusinessUnverified = {
	id: "2",
	name: "Startup Co.",
	profile_picture: null,
	username: "StartupCo",
	verification: "Unverified",
};

export const Default = {
	args: {
		business: mockBusiness,
	},
};

export const Unverified = {
	args: {
		business: mockBusinessUnverified,
	},
};

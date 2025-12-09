import { Tables } from "@/database.types";

export type IOffer = Tables<"Offer"> & {
	type: "Offer";
	businesses?: { business: Tables<"Business"> }[];
	tags?: { Tag: ITag }[];
	User_Offer?: Tables<"User_Offer">[];
	User?: Tables<"User">;
	products?: { Product: IProduct }[];
	stars?: number;
};

export type IPetition = Tables<"Petition"> & {
	type: "Petition";
	businesses?: { business: Tables<"Business"> }[];
	tags?: { Tag: ITag }[];
	User_Petition?: Tables<"User_Petition">[];
	User: Tables<"User">;
	products?: { Product: IProduct }[];
};

export type IBusiness = Tables<"Business"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
};

export type IUser = Tables<"User"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
};

export type IForum = Tables<"Forum"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
	Business?: Tables<"Business">;
	Forum_Tag?: {
		Tag: ITag;
	}[];
	User_Forum?: Tables<"User_Forum">[];
	Offer?: Pick<Tables<"Offer">, "id" | "state">[];
	Petition?: Pick<Tables<"Petition">, "id" | "state">[];
};

export type IProduct = Tables<"Product"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
	Review_Product?: Tables<"Review_Product">[];
};

export type IBusinessUser = Tables<"User_Business"> & {
	user?: Tables<"User">;
	business?: Tables<"Business">;
};

export type IBusinessEmployee = Tables<"Business_Employee"> & {
	user?: Tables<"User">;
	business?: Tables<"Business">;
};

export type IReview = Tables<"Review"> & {
	user?: Tables<"User">;
	User_Review?: Tables<"User_Review">[];
	Review_Product?: Tables<"Review_Product">[];
};

export type ICategory = Tables<"Category">;

export type IComment = Tables<"Comment"> & {
	user?: IUser;
	replies?: IComment[];
	replyCount?: number;
	Comment_Post?: {
		offer_id: number | null;
		petition_id: number | null;
		referenced_comment_id: number | null;
		referenced_user_id: string | null;
		review_id: number | null;
	}[];
	referencedUser?: IUser;
};

export type ITag = Tables<"Tag">;

export type INotification = Tables<"Notification"> & {
	sender?: Pick<IUser, "id" | "name" | "profile_picture">;
};

export interface IGetFromDatabase {
	tableName: string;
	select: string;
	eq?: [string, string | number];
	additionalEqs?: [string, string | number][];
}

export interface IPostToDatabase<T = unknown> {
	tableName: string;
	contentJson: T[];
}

export interface IPutToDatabase<T = unknown> {
	tableName: string;
	contentJson: Partial<T>;
	matchColumn: string;
	matchValue: string | number;
	additionalMatches?: [string, string | number][];
}

export interface IDeleteToDatabase {
	tableName: string;
	matchColumn: string;
	matchValue: string | number;
}

export type ISupabaseGenericFilter =
	| {
			method:
				| "eq"
				| "gt"
				| "lt"
				| "gte"
				| "lte"
				| "like"
				| "ilike"
				| "is"
				| "in"
				| "neq"
				| "contains"
				| "containedBy"
				| "not"
				| "or"
				| "order"
				| "range"
				| "single"
				| "limit"
				| "rangeFrom"
				| "rangeTo";
			column?: string;
			value?: unknown;
			operator?: string;
			ascending?: boolean;
			nullsFirst?: boolean;
			from?: number;
			to?: number;
	  }
	| { method: "or"; value: string };

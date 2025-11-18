import { Tables } from "@/database.types";

export type IOffer = Tables<"Offer"> & {
	type: "Offer";
	businesses?: {
		business: Tables<"Business">;
	}[];
	tags?: Tables<"Tag">[];
	User_Offer?: Tables<"User_Offer">[];
	User?: Tables<"User">;
};

export type IPetition = Tables<"Petition"> & {
	type: "Petition";
	businesses?: {
		business: Tables<"Business">;
	}[];
	tags?: Tables<"Tag">[];
	User_Petition?: Tables<"User_Petition">[];
	User: Tables<"User">;
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
		Tag: Tables<"Tag">;
	}[];
	User_Forum?: Tables<"User_Forum">[];
};

export type IProduct = Tables<"Product"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
};

export type IReview = Tables<"Review"> & {
	user?: Tables<"User">;
	User_Review?: Tables<"User_Review">[];
	Review_Product?: Tables<"Review_Product">[];
};

export type ICategory = Tables<"Category">;

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

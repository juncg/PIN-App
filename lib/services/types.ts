import { Tables } from "@/database.types";

export type IOffer = Tables<"Offer"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
	User_Offer?: Tables<"User_Offer">[];
};

export type IPetition = Tables<"Petition"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
	User_Petition?: Tables<"User_Petition">[];
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
};

export type IProduct = Tables<"Product"> & {
	businesses?: {
		business: Tables<"Business">;
	}[];
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

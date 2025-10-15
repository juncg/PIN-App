import { Tables } from "../types/supabase";

export type IOffer = Tables<"Offer">;
export type IPetition = Tables<"Petition">;
export type IProduct = Tables<"Product">;
export type IBusiness = Tables<"Business">;

export interface IGetFromDatabase {
	tableName: string;
	select: string;
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
}

export interface IDeleteToDatabase {
	tableName: string;
	matchColumn: string;
	matchValue: string | number;
}

import { Tables } from "../types/supabase";

export type IOffer = Tables<"Offer">;
export type IPetition = Tables<"Petition">;
export type IProduct = Tables<"Product">;

export interface IGetFromDatabase {
	tableName: string;
	select: string;
}

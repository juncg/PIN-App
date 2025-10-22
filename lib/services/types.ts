import { Tables } from "@/database.types";

export type IOffer = Tables<"Offer">;
export type IPetition = Tables<"Petition">;
export type IBusiness = Tables<"Business">;
export type IUser = Tables<"User">;
export type IForum = Tables<"Forum">;

export type IProduct = Tables<"Product"> & { 
    business?: IBusiness[];
};

export interface IGetFromDatabase {
    tableName: string;
    select: string;
    eq?: [string, string];
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

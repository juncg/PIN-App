import { IOffer, IPetition } from "./lib/services/types";

/* ****************************************************** TYPES ***************************************************** */

export type TPost = IOffer | IPetition;

/* *************************************************** INTERFACES *************************************************** */

export interface ISearchParams {
	locale?: string;
	postName?: string;
	search?: string;
	orderBy?: string;
	minPrice?: string;
	maxPrice?: string;
	categories?: string;
	minRating?: string;
}

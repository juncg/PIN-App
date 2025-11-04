import { IOffer, IPetition } from "./lib/services/types";

/* ****************************************************** TYPES ***************************************************** */

export type TPost = IOffer | IPetition;

/* *************************************************** INTERFACES *************************************************** */

export interface ISearchParams {
	locale?: string;
	postName?: string;
}

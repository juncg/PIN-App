import { Tables } from "../types/supabase";
import { GetClient } from "./general";

const { supabase } = GetClient();

export type OfferType = Tables<"Offer">;

export async function GetAllOffers(): Promise<OfferType[] | null> {
	const { data: offers, error } = await supabase.from("Offer").select("*");

	if (error) {
		console.error("Error fetching offers:", error);
	}

	return (offers as OfferType[]) || [];
}

export async function PostOffer(content: string[]): Promise<OfferType[] | null> {
	const { data: offer, error } = await supabase
		.from("Offer")
		.insert([{ content: content }])
		.select();

	if (error) {
		console.error("Error fetching offers:", error);
	}

	return offer;
}

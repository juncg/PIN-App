import { DEFAULT_LOCALE, PETITIONS_PAGE_SIZE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";

async function fetchPetitions(page: number = 0, pageSize: number = PETITIONS_PAGE_SIZE, postName: string = "") {
	const from = page * pageSize;
	const to = from + pageSize - 1;

	const { data: petitions } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), User!Petition_creator_id_fkey(*)`,
		filters: [
			{
				method: "range",
				from: from,
				to: to,
			},
			{
				method: "ilike",
				column: "title",
				value: `%${postName}%`,
			},
		],
	});

	petitions?.map((petition: IPetition) => {
		petition.type = "Petition";
	});

	return petitions || [];
}

export async function PetitionServices(searchParams: Promise<ISearchParams>) {
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "petitions" });

	return { translator };
}

export async function LoadMorePetitions(page: number, pageSize: number, postName: string = "") {
	"use server";
	return await fetchPetitions(page, pageSize, postName);
}

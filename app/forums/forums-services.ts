import { DEFAULT_LOCALE, FORUMS_PAGE_SIZE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";

async function fetchForums(page: number = 0, pageSize: number = FORUMS_PAGE_SIZE, forumName: string = "") {
	const from = page * pageSize;
	const to = from + pageSize - 1;

	const { data: forums, error } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `*, User_Forum!left(forum_id, user_id), Business(*)`,
		filters: [
			{
				method: "range",
				from: from,
				to: to,
			},
			{
				method: "ilike",
				column: "name",
				value: `%${forumName}%`,
			},
		],
	});

	return forums || [];
}

export async function ForumsServices(searchParams: Promise<ISearchParams>) {
	const uuid = await getUserUuid();

	const userBusinesses = await GetFromDatabase<{ business_id: number }>({
		tableName: "User_Business",
		select: "business_id",
		filters: [{ method: "eq", column: "user_id", value: uuid }],
	});

	const isBusinessUser = userBusinesses.data !== null && userBusinesses.data.length > 0;
	const params = await searchParams;
	const translator = await getTranslations({ locale: params.locale || DEFAULT_LOCALE, namespace: "forums" });

	const forums = await fetchForums(0, FORUMS_PAGE_SIZE, params.postName || "");

	return { translator, forums, isBusinessUser };
}

export async function LoadMoreForums(page: number, pageSize: number, forumName: string = "") {
	"use server";
	return await fetchForums(page, pageSize, forumName);
}

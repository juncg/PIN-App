import { DEFAULT_LOCALE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { ICategory, IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";

async function fetchForumsByCategory(categoryId: number, limit: number = 4) {
	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*, User_Forum!left(forum_id, user_id), Business(*), Forum_Category!inner(category_id)",
		filters: [
			{ method: "eq", column: "Forum_Category.category_id", value: categoryId },
			{ method: "range", from: 0, to: limit - 1 },
		],
	});

	return forums || [];
}

async function fetchRecommendedForums(limit: number = 6) {
	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*, User_Forum!left(forum_id, user_id), Business(*)",
		filters: [
			{ method: "order", column: "created_at", ascending: false },
			{ method: "range", from: 0, to: limit - 1 },
		],
	});

	return forums || [];
}

async function fetchPopularForums(limit: number = 6) {
	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*, User_Forum!left(forum_id, user_id), Business(*)",
		filters: [
			{ method: "order", column: "followers", ascending: false },
			{ method: "range", from: 0, to: limit - 1 },
		],
	});

	return forums || [];
}

function getRandomCategories(categories: ICategory[], count: number): ICategory[] {
	const shuffled = [...categories].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
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

	const { data: allCategories } = await GetFromDatabase<ICategory>({
		tableName: "Category",
		select: "*",
		filters: [{ method: "order", column: "name", ascending: true }],
	});

	const categories = allCategories || [];
	const categoryIds = params.categories ? params.categories.split(",").map(Number) : [];
	const hasSelectedCategories = categoryIds.length > 0;

	let recommendedForums: IForum[] = [];
	let popularForums: IForum[] = [];
	let trendingByCategory: { category: ICategory; forums: IForum[] }[] = [];

	if (hasSelectedCategories) {
		const selectedCategories = categories.filter((cat) => categoryIds.includes(cat.id));

		trendingByCategory = await Promise.all(
			selectedCategories.map(async (category) => ({
				category,
				forums: await fetchForumsByCategory(category.id, 4),
			}))
		);
	} else {
		recommendedForums = await fetchRecommendedForums(4);
		popularForums = await fetchPopularForums(4);

		const randomCategories = getRandomCategories(categories, 2);

		trendingByCategory = await Promise.all(
			randomCategories.map(async (category) => ({
				category,
				forums: await fetchForumsByCategory(category.id, 4),
			}))
		);
	}

	return {
		translator,
		isBusinessUser,
		categories,
		hasSelectedCategories,
		recommendedForums,
		popularForums,
		trendingByCategory,
	};
}

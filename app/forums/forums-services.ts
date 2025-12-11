import { DEFAULT_LOCALE } from "@/lib/constants";
import { GetFromDatabase } from "@/lib/services/general";
import { ICategory, IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { getTranslations } from "next-intl/server";
import { ISearchParams } from "../../types";

const BASE_FORUM_SELECT = `
    *,
    User_Forum!left(forum_id, user_id),
    Business(*),
    Offer!left(id, state),
    Petition!left(id)
`;

async function fetchForumsByCategory(categoryId: number, limit: number = 7) {
	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: `${BASE_FORUM_SELECT}, Forum_Category!inner(category_id)`,
		filters: [
			{ method: "eq", column: "Forum_Category.category_id", value: categoryId },
			{ method: "limit", value: limit },
		],
	});

	return forums || [];
}

async function fetchRecommendedForums(limit: number = 7) {
	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: BASE_FORUM_SELECT,
		filters: [
			{ method: "order", column: "created_at", ascending: false },
			{ method: "limit", value: limit },
		],
	});

	return forums || [];
}

async function fetchPopularForums(limit: number = 6) {
	const { data: forums } = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: BASE_FORUM_SELECT,
		filters: [
			{ method: "order", column: "followers", ascending: false },
			{ method: "limit", value: limit },
		],
	});

	return forums || [];
}

function getRandomCategories(categories: ICategory[], count: number): ICategory[] {
	const shuffled = [...categories].sort(() => 0.5 - Math.random());
	return shuffled.slice(0, count);
}

async function getTrendingByCategory(
	categories: ICategory[],
	limit: number
): Promise<{ category: ICategory; forums: IForum[] }[]> {
	return Promise.all(
		categories.map(async (category) => ({
			category,
			forums: await fetchForumsByCategory(category.id, limit),
		}))
	);
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
		trendingByCategory = await getTrendingByCategory(selectedCategories, 4);
	} else {
		recommendedForums = await fetchRecommendedForums(4);
		popularForums = await fetchPopularForums(4);

		const randomCategories = getRandomCategories(categories, 2);
		trendingByCategory = await getTrendingByCategory(randomCategories, 4);
	}

	const clientTranslations = {
		followed: translator("followed"),
		follow: translator("follow"),
	};

	return {
		clientTranslations,
		translator,
		isBusinessUser,
		categories,
		hasSelectedCategories,
		recommendedForums,
		popularForums,
		trendingByCategory,
	};
}


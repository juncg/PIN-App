import { H2 } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "../../types";
import { ForumsServices } from "./forums-services";
import { ForumCard } from "@/components/cards/forum-card";
import { CategoriesCarousel } from "@/components/carousel/categories-carousel";

export default async function Forums({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { categories, hasSelectedCategories, recommendedForums, popularForums, trendingByCategory } =
		await ForumsServices(searchParams);

	const userUuid = await getUserUuid();

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="mb-8 text-sm text-muted-foreground">
				<span>Inicio</span> <span className="mx-2">/</span>{" "}
				<span className="text-foreground font-medium">Foros</span>
			</div>

			<CategoriesCarousel categories={categories} />

			{!hasSelectedCategories && (
				<>
					<div className="space-y-6">
						<H2 className="text-2xl font-bold">Recomendado para ti.</H2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{recommendedForums.map((forum) => (
								<ForumCard key={forum.id} forum={forum} currentUserId={userUuid} />
							))}
						</div>
					</div>

					<div className="space-y-6">
						<H2 className="text-2xl font-bold">Lo más popular.</H2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{popularForums.map((forum) => (
								<ForumCard key={forum.id} forum={forum} currentUserId={userUuid} />
							))}
						</div>
					</div>
				</>
			)}

			{trendingByCategory.map(({ category, forums }) => (
				<div key={category.id} className="space-y-6">
					<H2 className="text-2xl font-bold">Tendencia en {category.name}.</H2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{forums.map((forum) => (
							<ForumCard key={forum.id} forum={forum} currentUserId={userUuid} />
						))}
					</div>
				</div>
			))}
		</section>
	);
}

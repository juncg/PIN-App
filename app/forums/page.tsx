import { ForumCard } from "@/components/cards/forum-card";
import { CategoriesCarousel } from "@/components/carousel/categories-carousel";
import { H2 } from "@/components/ui-custom/typography";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "../../types";
import { ForumsServices } from "./forums-services";
import Link from "next/link";
import { CreateFab } from "@/components/buttons/create-floating-action-button";
export default async function Forums({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { categories, hasSelectedCategories, recommendedForums, popularForums, trendingByCategory, isBusinessUser } =
		await ForumsServices(searchParams);

	const userUuid = await getUserUuid();

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="mb-8 text-sm text-lightgrey">
				<Link href="/home" className="hover:underline">
					Inicio
				</Link>
				<span className="mx-2">/</span> <span className="text-white font-medium">Foros</span>
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
						{forums.length === 0 ? (
							<div className="text-center col-span-full">
								<p className="text-xl text-lightgrey">No hay foros a mostrar.</p>
							</div>
						) : (
							forums.map((forum) => <ForumCard key={forum.id} forum={forum} currentUserId={userUuid} />)
						)}
					</div>
				</div>
			))}

			{isBusinessUser && <CreateFab isBusinessUser={true} enabledOptions={["forum"]} />}
		</section>
	);
}

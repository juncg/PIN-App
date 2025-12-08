import { CreateFab } from "@/components/buttons/create-floating-action-button";
import { PostCardHorizontal } from "@/components/cards/post-card-horizontal";
import { PostTypeFilter } from "@/components/filters/post-type-filter";
import PostsSidebar from "@/components/filters/posts-filters";
import { OrderSelect } from "@/components/select/order-select";
import { ISearchParams } from "@/types";
import { PostsServices } from "./page-services";

export default async function PostsPage({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { clientTranslations, posts, popularTags, currentUserId, isBusinessUser } = await PostsServices(searchParams);
	const params = await searchParams;

	return (
		<div className="flex min-h-screen flex-col w-full">
			<div className="flex-1 w-full">
				<div className="flex gap-8 mt-6 w-full">
					<aside className="w-80 shrink-0">
						<PostsSidebar popularTags={popularTags} />
					</aside>

					<main className="flex-1 min-w-0 pr-4">
						<div className="mb-6">
							<PostTypeFilter />
						</div>
						<div className="mb-6 flex items-center justify-between">
							<p className="text-sm font-medium text-lightgrey-foreground">
								{posts.length} {posts.length === 1 ? "resultado" : "resultados"}
							</p>
							<OrderSelect
								options={[
									{ value: "newest", label: clientTranslations.newest },
									{ value: "oldest", label: clientTranslations.oldest },
									{ value: "price_low_high", label: clientTranslations.price_low_high },
									{ value: "price_high_low", label: clientTranslations.price_high_low },
								]}
								placeholder={clientTranslations.sort_by}
								defaultValue={params.orderBy || "newest"}
							/>
						</div>
						<div className="space-y-6">
							{posts.length === 0 ? (
								<p className="text-center text-lightgrey-foreground py-12">
									No se encontraron publicaciones
								</p>
							) : (
								posts.map((post) => <PostCardHorizontal key={`${post.type}-${post.id}`} post={post} />)
							)}
						</div>
					</main>
				</div>
			</div>
			{currentUserId && <CreateFab isBusinessUser={isBusinessUser} enabledOptions={["offer", "petition"]} />}
		</div>
	);
}

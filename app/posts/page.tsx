import { PostCardHorizontal } from "@/components/cards/post-card-horizontal";
import { PostTypeFilter } from "@/components/filters/post-type-filter";
import { OrderSelect } from "@/components/select/order-select";
import PostsSidebar from "@/components/sidebar/posts-filters";
import { ISearchParams } from "@/types";
import Link from "next/link";
import { PostsServices } from "./page-services";
export default async function PostsPage({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, clientTranslations, posts, postType, popularTags, currentUserId } = await PostsServices(
		searchParams
	);
	const params = await searchParams;

	return (
		<div className="flex min-h-screen flex-col">
			<div className="container flex-1 px-4 py-6">
				<div className="mb-8 text-sm text-lightgrey">
					<Link href="/home" className="hover:underline">
						Inicio
					</Link>
					<span className="mx-2">/</span> <span className="text-white font-medium">Ofertas y peticiones</span>
				</div>

				<div className="flex gap-8 mt-6">
					<aside className="w-64 shrink-0">
						<PostsSidebar popularTags={popularTags} />
					</aside>

					<main className="flex-1 min-w-0">
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
		</div>
	);
}

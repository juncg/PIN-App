import { InfinitePostList } from "@/components/posts/infinite-post-list";
import { SearchInput } from "@/components/search/search";
import { Button } from "@/components/ui-custom/button";
import { H1, P } from "@/components/ui-custom/typography";
import { PETITIONS_MAX_POSTS, PETITIONS_PAGE_SIZE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { LoadMorePetitions, PetitionServices } from "./page-services";

export default async function Petitions({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, petitions } = await PetitionServices(searchParams);
	const userUuid = await getUserUuid();
	const params = await searchParams;

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<H1>{translator("petitions")}</H1>
					<P className="text-muted">Aqui puedes ver las peticiones existentes</P>
				</div>

				<Link href={userUuid ? "/petitions/create" : "/auth/login"}>
					<Button className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Nueva Peticion
					</Button>
				</Link>
			</div>

			<SearchInput />

			<InfinitePostList
				initialPosts={petitions ?? []}
				loadMoreAction={LoadMorePetitions}
				searchParams={params}
				pageSize={PETITIONS_PAGE_SIZE}
				maxPosts={PETITIONS_MAX_POSTS}
			/>
		</section>
	);
}

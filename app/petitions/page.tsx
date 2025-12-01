import { InfinitePostGrid } from "@/components/posts/infinite-post-grid";
import { SearchInput } from "@/components/search/search";
import { Button } from "@/components/ui-custom/button";
import { B1, H1 } from "@/components/ui-custom/typography";
import { PETITIONS_MAX_POSTS, PETITIONS_PAGE_SIZE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { LoadMorePetitions, PetitionServices } from "./page-services";

export default async function Petitions({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator } = await PetitionServices(searchParams);
	const userUuid = await getUserUuid();
	const params = await searchParams;

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<H1>{translator("petitions")}</H1>
					<B1 className="text-lightgrey">Aqui puedes ver las peticiones existentes</B1>
				</div>

				<Link href={userUuid ? "/petitions/create" : "/auth/login"}>
					<Button className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Nueva Peticion
					</Button>
				</Link>
			</div>

			<SearchInput />

			<InfinitePostGrid
				loadMoreAction={LoadMorePetitions}
				searchParams={params}
				pageSize={2}
				maxPosts={8}
				userUuid={userUuid}
			/>
		</section>
	);
}

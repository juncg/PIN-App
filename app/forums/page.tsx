import { InfiniteForumList } from "@/components/forums/infinite-forum-list";
import { SearchInput } from "@/components/search/search";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { FORUMS_MAX_POSTS, FORUMS_PAGE_SIZE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { ForumsServices, LoadMoreForums } from "./forums-services";

export default async function Forums({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, forums, isBusinessUser } = await ForumsServices(searchParams);
	const userUuid = await getUserUuid();
	const params = await searchParams;

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<H1>{translator("forums")}</H1>
					<P className="text-muted-foreground">Aqui puedes ver los foros existentes</P>
				</div>

				{userUuid && isBusinessUser && (
					<Link href={"/forums/create"}>
						<Button className="flex items-center gap-2">
							<Plus className="w-5 h-5" />
							Nuevo Foro
						</Button>
					</Link>
				)}
			</div>

			<SearchInput />

			<InfiniteForumList
				initialForums={forums ?? []}
				loadMoreAction={LoadMoreForums}
				searchParams={params}
				pageSize={FORUMS_PAGE_SIZE}
				maxForums={FORUMS_MAX_POSTS}
			/>
		</section>
	);
}

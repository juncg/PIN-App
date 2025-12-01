import { InfinitePostGrid } from "@/components/posts/infinite-post-grid";
import { SearchInput } from "@/components/search/search";
import { Button } from "@/components/ui-custom/button";
import { B1, H1 } from "@/components/ui-custom/typography";
import { OFFERS_MAX_POSTS, OFFERS_PAGE_SIZE } from "@/lib/constants";
import { getUserUuid } from "@/lib/services/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { LoadMoreOffers, OfferServices } from "./page-services";

export default async function Offers({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, isBusinessUser } = await OfferServices(searchParams);
	const userUuid = await getUserUuid();
	const params = await searchParams;

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<H1>{translator("offers")}</H1>
					<B1 className="text-lightgrey">Aqui puedes ver las ofertas existentes</B1>
				</div>

				{userUuid && isBusinessUser && (
					<Link href={"/offers/create"}>
						<Button className="flex items-center gap-2">
							<Plus className="w-5 h-5" />
							Nueva Oferta
						</Button>
					</Link>
				)}
			</div>

			<SearchInput />

			<InfinitePostGrid
				loadMoreAction={LoadMoreOffers}
				searchParams={params}
				pageSize={OFFERS_PAGE_SIZE}
				maxPosts={OFFERS_MAX_POSTS}
				userUuid={userUuid}
			/>
		</section>
	);
}

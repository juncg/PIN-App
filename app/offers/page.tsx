import { PostList } from "@/components/posts/post-list";
import { SearchInput } from "@/components/search/search";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { getUserUuid } from "@/lib/services/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { OfferServices } from "./page-services";

export default async function Offers({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, offers } = await OfferServices(searchParams);
	const userUuid = await getUserUuid();

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<H1>{translator("offers")}</H1>
					<P className="text-muted-foreground">Aqui puedes ver las ofertas existentes</P>
				</div>

				<Link href={userUuid ? "/offers/create" : "/auth/login"}>
					<Button className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Nueva Oferta
					</Button>
				</Link>
			</div>

			<SearchInput />

			<PostList items={offers ?? []} />
		</section>
	);
}

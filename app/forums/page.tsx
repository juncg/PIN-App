import { SearchInput } from "@/components/search/search";
import { H1, H2, P } from "@/components/ui-custom/typography";
import { Button } from "@/components/ui/button";
import { getUserUuid } from "@/lib/services/user";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ISearchParams } from "../../types";
import { ForumsServices } from "./forums-services";
import { ForumCard } from "@/components/cards/forum-card";

export default async function Forums({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, forums, isBusinessUser, popularForums } = await ForumsServices(searchParams);
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

			<div className="space-y-6">
				<H2 className="text-2xl font-bold">Recomendado para ti.</H2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{forums &&
						forums
							.slice(0, 4)
							.map((forum) => <ForumCard key={forum.id} forum={forum} currentUserId={userUuid} />)}
				</div>
			</div>

			<div className="space-y-6">
				<H2 className="text-2xl font-bold">Lo más popular.</H2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{popularForums &&
						popularForums
							.slice(0, 4)
							.map((forum) => <ForumCard key={forum.id} forum={forum} currentUserId={userUuid} />)}
				</div>
			</div>

			<div className="space-y-6">
				<H2 className="text-2xl font-bold">Trending en X CATEGORIA.</H2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"></div>
			</div>

			<div className="space-y-6">
				<H2 className="text-2xl font-bold">Trending en Y CATEGORIA.</H2>
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"></div>
			</div>
		</section>
	);
}

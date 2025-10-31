import SearchItems from "@/components/search/search";
import { Button } from "@/components/ui/button";
import { getUserUuid } from "@/lib/services/user.server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { OfferServices } from "./page-services";

export default async function Offers() {
	const { offers } = await OfferServices();
	const userUuid = await getUserUuid();

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<h1>Ofertas</h1>
					<p className="text-muted-foreground">Aqui puedes ver las ofertas existentes</p>
				</div>

				<Link href={userUuid ? "/offers/create" : "/auth/login"}>
					<Button className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Nueva Oferta
					</Button>
				</Link>
			</div>

			<SearchItems items={offers} postType="Oferta" userUuid={userUuid || ""} />
		</section>
	);
}

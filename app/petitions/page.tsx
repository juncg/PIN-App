import SearchItems from "@/components/search/search";
import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PetitionServices } from "./page-services";

export default async function Petitions() {
	const { petitions } = await PetitionServices();

	return (
		<section className="max-w-7xl mx-auto space-y-8">
			<div className="flex justify-between items-center">
				<div className="justify-start">
					<H1>Peticiones</H1>
					<P className="text-muted-foreground">Aqui puedes ver las peticiones existentes</P>
				</div>

				<Link href="/petitions/create">
					<Button className="flex items-center gap-2">
						<Plus className="w-5 h-5" />
						Nueva Peticion
					</Button>
				</Link>
			</div>

			<SearchItems items={petitions} postType="Petición" />
		</section>
	);
}

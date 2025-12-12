import { ISearchParams } from "../../types";
import { HomeColumns } from "./home-columns";
import { HomeServices } from "./page-services";

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translations, offers, petitions, products } = await HomeServices(searchParams);

	return (
		<section className="flex flex-row justify-center !gap-12 h-[calc(100vh-6rem)] px-8 mx-auto max-w-[1500px]">
			<HomeColumns
				petitions={petitions || []}
				offers={offers || []}
				products={products || []}
				translations={translations}
			/>
		</section>
	);
}

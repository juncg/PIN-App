import { ISearchParams } from "../../types";
import { HomeColumns } from "./home-columns";
import { HomeServices } from "./page-services";

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
    const { translations, offers, petitions, products } = await HomeServices(searchParams);

    return (
        <section className="flex flex-row justify-center !gap-12 px-8 mx-auto max-w-[1400px] py-8">
            <HomeColumns
                petitions={petitions || []}
                offers={offers || []}
                products={products || []}
                translations={translations}
            />
        </section>
    );
}

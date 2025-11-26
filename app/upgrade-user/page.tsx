import CreateJoinBusinessForm from "@/components/forms/create-join-business";
import { ISearchParams } from "@/types";
import { HomeServices } from "../home/page-services";

export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, offers, petitions, products } = await HomeServices(searchParams);
	return <CreateJoinBusinessForm />;
}

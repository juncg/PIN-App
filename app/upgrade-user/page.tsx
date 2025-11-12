import { ISearchParams } from "@/types";
import { HomeServices } from "../home/page-services";
import CreateJoinBusinessForm from "@/components/forms/create-join-business";


export default async function Home({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, offers, petitions, products } = await HomeServices(searchParams);
	return (

		<CreateJoinBusinessForm forums={[]} tags={[]} />

	)
}
import { redirect } from "next/navigation";
import { ISearchParams } from "../../types";
export default async function Offers({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	redirect("/posts");
}

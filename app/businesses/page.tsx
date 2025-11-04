import { BusinessCard } from "@/components/cards/businessCard";
import { H1 } from "@/components/ui/typography";
import { IBusiness } from "@/lib/services/types";
import { SearchParams } from "../types";
import { BusinessesServices } from "./page-services";

export default async function Businesses({ searchParams }: { searchParams: Promise<SearchParams> }) {
	const { translator, businesses } = await BusinessesServices(searchParams);

	return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-col items-baseline gap-8 w-1/3">
				<H1>{translator("businesses")}</H1>

				{businesses?.map((business: IBusiness) => (
					<BusinessCard
						key={business.id}
						props={{
							className: "w-full",
							businessName: business.name || "N/A",
							businessDescription: business.description || "N/A",
						}}
					/>
				))}
			</div>
		</section>
	);
}

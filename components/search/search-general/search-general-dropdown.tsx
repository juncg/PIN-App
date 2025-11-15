"use client";

import { H4, P } from "@/components/ui-custom/typography";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IBusiness, IForum, IOffer, IPetition, IProduct, IUser } from "@/lib/services/types";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SearchGeneralDropdownItem } from "./search-general-dropdown-item";
import { SearchGeneralServices } from "./search-general-services";

interface SearchResults {
	offers: IOffer[];
	petitions: IPetition[];
	forums: IForum[];
	businesses: IBusiness[];
	products: IProduct[];
	users: IUser[];
}

export function SearchGeneralDropdown() {
	const searchParams = useSearchParams();
	const [results, setResults] = useState<SearchResults>({
		offers: [],
		petitions: [],
		forums: [],
		businesses: [],
		products: [],
		users: [],
	});
	const [isLoading, setIsLoading] = useState(false);
	const searchQuery = searchParams.get("search");

	useEffect(() => {
		if (searchQuery) {
			setIsLoading(true);
			SearchGeneralServices(searchQuery)
				.then((data) => {
					setResults(data);
				})
				.finally(() => setIsLoading(false));
		} else {
			setResults({
				offers: [],
				petitions: [],
				forums: [],
				businesses: [],
				products: [],
				users: [],
			});
		}
	}, [searchQuery]);

	if (!searchQuery) return null;

	const hasResults =
		results.offers.length > 0 ||
		results.petitions.length > 0 ||
		results.forums.length > 0 ||
		results.businesses.length > 0 ||
		results.products.length > 0 ||
		results.users.length > 0;

	return (
		<Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg">
			{isLoading ? (
				<div className="flex items-center justify-center p-8">
					<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			) : hasResults ? (
				<div>
					{results.offers.length > 0 && (
						<div>
							<div className="px-4 py-2 bg-muted/50">
								<H4 className="text-sm font-semibold">Ofertas</H4>
							</div>
							<div className="divide-y">
								{results.offers.map((offer) => (
									<SearchGeneralDropdownItem key={`offer-${offer.id}`} item={offer} type="offer" />
								))}
							</div>
						</div>
					)}

					{results.petitions.length > 0 && (
						<div>
							{results.offers.length > 0 && <Separator />}
							<div className="px-4 py-2 bg-muted/50">
								<H4 className="text-sm font-semibold">Peticiones</H4>
							</div>
							<div className="divide-y">
								{results.petitions.map((petition) => (
									<SearchGeneralDropdownItem
										key={`petition-${petition.id}`}
										item={petition}
										type="petition"
									/>
								))}
							</div>
						</div>
					)}

					{results.forums.length > 0 && (
						<div>
							{(results.offers.length > 0 || results.petitions.length > 0) && <Separator />}
							<div className="px-4 py-2 bg-muted/50">
								<H4 className="text-sm font-semibold">Foros</H4>
							</div>
							<div className="divide-y">
								{results.forums.map((forum) => (
									<SearchGeneralDropdownItem key={`forum-${forum.id}`} item={forum} type="forum" />
								))}
							</div>
						</div>
					)}

					{results.businesses.length > 0 && (
						<div>
							{(results.offers.length > 0 ||
								results.petitions.length > 0 ||
								results.forums.length > 0) && <Separator />}
							<div className="px-4 py-2 bg-muted/50">
								<H4 className="text-sm font-semibold">Empresas</H4>
							</div>
							<div className="divide-y">
								{results.businesses.map((business) => (
									<SearchGeneralDropdownItem
										key={`business-${business.id}`}
										item={business}
										type="business"
									/>
								))}
							</div>
						</div>
					)}

					{results.products.length > 0 && (
						<div>
							{(results.offers.length > 0 ||
								results.petitions.length > 0 ||
								results.forums.length > 0 ||
								results.businesses.length > 0) && <Separator />}
							<div className="px-4 py-2 bg-muted/50">
								<H4 className="text-sm font-semibold">Productos</H4>
							</div>
							<div className="divide-y">
								{results.products.map((product) => (
									<SearchGeneralDropdownItem
										key={`product-${product.id}`}
										item={product}
										type="product"
									/>
								))}
							</div>
						</div>
					)}

					{results.users.length > 0 && (
						<div>
							{(results.offers.length > 0 ||
								results.petitions.length > 0 ||
								results.forums.length > 0 ||
								results.businesses.length > 0 ||
								results.products.length > 0) && <Separator />}
							<div className="px-4 py-2 bg-muted/50">
								<H4 className="text-sm font-semibold">Usuarios</H4>
							</div>
							<div className="divide-y">
								{results.users.map((user) => (
									<SearchGeneralDropdownItem key={`user-${user.id}`} item={user} type="user" />
								))}
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="p-8 text-center">
					<P className="text-muted-foreground">No se encontraron resultados</P>
				</div>
			)}
		</Card>
	);
}

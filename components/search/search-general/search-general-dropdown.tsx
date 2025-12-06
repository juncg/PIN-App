"use client";

import { Card } from "@/components/ui-custom/card";
import { B1, H4 } from "@/components/ui-custom/typography";
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

interface SearchGeneralDropdownProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SearchGeneralDropdown({ isOpen, onClose }: SearchGeneralDropdownProps) {
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
		if (searchQuery && isOpen) {
			setIsLoading(true);
			SearchGeneralServices(searchQuery)
				.then((data) => {
					setResults(data);
				})
				.finally(() => setIsLoading(false));
		} else if (!searchQuery) {
			setResults({
				offers: [],
				petitions: [],
				forums: [],
				businesses: [],
				products: [],
				users: [],
			});
		}
	}, [searchQuery, isOpen]);

	if (!searchQuery || !isOpen) return null;

	const hasResults =
		results.offers.length > 0 ||
		results.petitions.length > 0 ||
		results.forums.length > 0 ||
		results.businesses.length > 0 ||
		results.products.length > 0 ||
		results.users.length > 0;

	return (
		<Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto z-50 shadow-lg border-[2px]">
			{isLoading ? (
				<div className="flex items-center justify-center p-8">
					<Loader2 className="h-6 w-6 animate-spin text-lightgrey" />
				</div>
			) : hasResults ? (
				<div>
					{results.offers.length > 0 && (
						<div>
							<div className="px-4 pt-4">
								<H4>Ofertas</H4>
							</div>
							<div className="divide-y-2">
								{results.offers.map((offer) => (
									<SearchGeneralDropdownItem key={`offer-${offer.id}`} item={offer} type="offer" />
								))}
							</div>
						</div>
					)}

					{results.petitions.length > 0 && (
						<div>
							<div className="px-4 pt-4">
								<H4>Peticiones</H4>
							</div>
							<div className="divide-y-2">
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
							<div className="px-4 pt-4">
								<H4>Foros</H4>
							</div>
							<div className="divide-y-2">
								{results.forums.map((forum) => (
									<SearchGeneralDropdownItem key={`forum-${forum.id}`} item={forum} type="forum" />
								))}
							</div>
						</div>
					)}

					{results.businesses.length > 0 && (
						<div>
							<div className="px-4 pt-4">
								<H4>Empresas</H4>
							</div>
							<div className="divide-y-2">
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
							<div className="px-4 pt-4">
								<H4>Productos</H4>
							</div>
							<div className="divide-y-2">
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
							<div className="px-4 pt-4">
								<H4>Usuarios</H4>
							</div>
							<div className="divide-y-2">
								{results.users.map((user) => (
									<SearchGeneralDropdownItem key={`user-${user.id}`} item={user} type="user" />
								))}
							</div>
						</div>
					)}
				</div>
			) : (
				<div className="p-8 text-center">
					<B1 className="text-lightgrey">No se encontraron resultados</B1>
				</div>
			)}
		</Card>
	);
}

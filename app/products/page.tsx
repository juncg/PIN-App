import { CreateFab } from "@/components/buttons/create-floating-action-button";
import { ProductCard } from "@/components/cards/product-card";
import ProductsFilters from "@/components/filters/products-filters";
import { OrderSelect } from "@/components/select/order-select";
import { ScrollArea, ScrollBar } from "@/components/ui-custom/scroll-area";
import { B3 } from "@/components/ui-custom/typography";
import { IProduct } from "@/lib/services/types";
import { ISearchParams } from "@/types";
import { ProductServices } from "./page-services";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { products, categories, clientTranslations, currentUserId, isBusinessUser } = await ProductServices(
		searchParams
	);
	const params = await searchParams;

	return (
		<div className="flex min-h-screen flex-col">
			<div className="flex-1 px-4 pb-6">
				<div className="flex gap-8">
					<aside className="w-64 fixed top-24 z-20 h-[calc(100vh-8rem)]">
						<ScrollArea className="pr-6 h-full">
							<ProductsFilters categories={categories ?? []} />
							<ScrollBar />
						</ScrollArea>
					</aside>

					<main className="flex-1 min-w-0 ml-72">
						<div className="mb-6 flex items-center justify-between">
							<B3>Todos los productos ({products?.length || 0})</B3>

							<OrderSelect
								options={[
									{ value: "newest", label: clientTranslations.newest },
									{ value: "oldest", label: clientTranslations.oldest },
									{ value: "price_low_high", label: clientTranslations.price_low_high },
									{ value: "price_high_low", label: clientTranslations.price_high_low },
									{ value: "rating_low_high", label: clientTranslations.rating_low_high },
									{ value: "rating_high_low", label: clientTranslations.rating_high_low },
								]}
								placeholder={clientTranslations.sort_by}
								defaultValue={params.orderBy || "newest"}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{products?.map((product: IProduct) => (
								<ProductCard
									key={product.id}
									props={{
										className: "w-full",
										product: product,
									}}
								/>
							))}
						</div>
					</main>
				</div>
			</div>
			{currentUserId && <CreateFab isBusinessUser={isBusinessUser} enabledOptions={["product"]} />}
		</div>
	);
}

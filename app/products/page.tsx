import { ProductCard } from "@/components/cards/product-card";
import { OrderSelect } from "@/components/select/order-select";
import ProductsFilters from "@/components/sidebar/products-filters";
import { IProduct } from "@/lib/services/types";
import { ISearchParams } from "@/types";
import { ProductServices } from "./page-services";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, products, categories, clientTranslations } = await ProductServices(searchParams);
	const params = await searchParams;

	return (
		<div className="flex min-h-screen flex-col">
			<div className="container flex-1 px-4 py-6">
				<div className="mb-8 text-sm text-lightgrey">
					<span>Inicio</span> <span className="mx-2">/</span>{" "}
					<span className="text-white font-medium">Productos</span>
				</div>

				<div className="flex gap-8">
					<aside className="w-64 shrink-0">
						<ProductsFilters categories={categories ?? []} />
					</aside>

					<main className="flex-1 min-w-0">
						<div className="mb-6 flex items-center justify-between">
							<p className="text-sm font-medium text-lightgrey">
								Todos los productos ({products?.length || 0})
							</p>
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
										translator: translator,
									}}
								/>
							))}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

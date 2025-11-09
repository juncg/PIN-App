import { ProductCard } from "@/components/cards/productCard";
import ProductsFilters from "@/components/sidebar/products-filters";
import { IProduct } from "@/lib/services/types";
import { ISearchParams } from "@/types";
import { ProductServices } from "./page-services";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const { translator, products, categories } = await ProductServices(searchParams);

	return (
		<div className="flex min-h-screen flex-col">
			<div className="container flex-1 px-4 py-6">
				<div className="flex gap-6">
					<aside className="w-64 shrink-0">
						<ProductsFilters categories={categories ?? []} />
					</aside>

					<main className="flex-1 min-w-0">
						<div className="mb-4 flex items-center justify-between">
							<p className="text-sm text-muted-foreground">
								{translator("showing_x_products", {
									count: products?.length.toLocaleString() || 0,
								})}
							</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{products?.map((product: IProduct) => (
								<ProductCard
									key={product.id}
									props={{
										className: "w-full",
										name: product.name,
										description: product.description,
										businessName:
											(product.businesses && product.businesses[0]?.business?.name) || "N/A",
										translator: translator,
										id: product.id,
										price: product.msrp || 0,
										rating: product.rating || 0,
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

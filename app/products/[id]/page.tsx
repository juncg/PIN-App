import { ISearchParams } from "@/types";
import { ProductDetails } from "@/components/products/product-details";
import { ProductDetailsServices } from "./page-services";

interface ProductPageProps {
	params: Promise<{
		id: number;
	}>;
	searchParams: Promise<ISearchParams>;
}

export default async function ProductsPage({ params }: ProductPageProps) {
	const { id } = await params;
	const { product, ratingDistribution, numOfReviews } = await ProductDetailsServices(id);

	return (
		<div>
			<ProductDetails product={product} ratingDistribution={ratingDistribution} numOfReviews={numOfReviews} />
		</div>
	);
}

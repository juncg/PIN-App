import { IProduct } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import Link from "next/link";
import { CardImagesCarousel } from "../carousel/card-images-carousel";
import { B3, B5, H4, H5DisplayBold } from "../ui-custom/typography";

export interface IProductCard {
	className?: string;
	product: IProduct;
}

export function ProductCard({ props }: { props: IProductCard }) {
	const { className, product } = props;

	const displayImages: string[] = product.images?.filter((img) => img && img.trim() !== "")?.length
		? product.images.filter((img) => img && img.trim() !== "")
		: ["/placeholder.png"];

	return (
		<article
			className={cn(
				"flex flex-col h-full overflow-hidden rounded-2xl border border-cardborder bg-darkmode transition-all group",
				className
			)}
		>
			<CardImagesCarousel product={product} displayImages={displayImages} />

			<div className="relative flex flex-1 flex-col p-4">
				<B5 className="uppercase text-lightgrey tracking-wider mb-1">
					{product.businesses?.[0]?.business?.name || "EMPRESA DESCONOCIDA"}
				</B5>

				<Link href={`/products/${product.id}`}>
					<H4 className="mb-2 pr-6 hover:underline">{product.name}</H4>
					{product.description && <B3 className="mb-4 line-clamp-2">{product.description}</B3>}
				</Link>

				<div className="mt-auto flex items-end justify-between">
					<div className="flex items-center gap-1">
						<Star className="h-4 w-4 fill-white" />

						<span className="flex items-center gap-2">
							<H5DisplayBold className="font-bold">{product.rating?.toFixed(1)}</H5DisplayBold>
							<B5>({product.Review_Product?.length} reviews)</B5>
						</span>
					</div>

					<H4>{product.msrp?.toFixed(2)}€</H4>
				</div>
			</div>
		</article>
	);
}

import { IProduct } from "@/lib/services/types";
import Image from "next/image";
import Link from "next/link";

export function ProductCardHorizontal(product: IProduct) {
	return (
		<div className="group flex min-h-[8.75rem] w-full cursor-pointer rounded-[20px] border-[2px] border-cardborder bg-darkmode transition-colors hover:bg-hover">
			<div className="relative aspect-square h-[8.75rem] flex-shrink-0 overflow-hidden rounded-[20px] border-[2px] border-darkmode">
				<Image
					src={product.images?.[0] || "/placeholder.png"}
					alt={product.name}
					fill
					className="object-cover"
					unoptimized
				/>
			</div>

			<div className="flex flex-1 flex-col justify-between py-4 px-5">
				<div className="text-[0.6875rem] font-medium uppercase tracking-widest text-lightgrey">
					{product.businesses?.[0]?.business?.name}
				</div>
				<h4 className="text-[1.125rem] font-medium leading-tight text-white line-clamp-2 group-hover:underline">
					<Link href={`/products/${product.id}`}>{product.name}</Link>
				</h4>
				<div className="text-[1.25rem] font-bold text-white">{product.msrp?.toFixed(2)}€</div>
			</div>
		</div>
	);
}

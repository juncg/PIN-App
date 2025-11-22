import Image from "next/image";
import { IProduct } from "@/lib/services/types";
import Link from "next/link";

export function ProductCardHorizontal(product: IProduct) {
	return (
		<div className="group flex h-[140px] w-full cursor-pointer rounded-[20px] border-[2px] bg-card transition-colors hover:bg-accent">
			<div className="relative aspect-square h-full flex-shrink-0 overflow-hidden rounded-[20px] bg-white">
				<Image
					src={product.images?.[0] || "/placeholder.png"}
					alt={product.name}
					fill
					className="object-cover"
					unoptimized
				/>
			</div>

			<div className="flex flex-1 flex-col justify-between py-4 px-5">
				<div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
					{product.businesses?.[0]?.business?.name}
				</div>
				<h4 className="text-lg font-medium leading-tight text-card-foreground line-clamp-3 group-hover:underline">
					<Link href={`/products/${product.id}`}>{product.name}</Link>
				</h4>
				<div className="text-xl font-bold text-card-foreground">{product.msrp}€</div>
			</div>
		</div>
	);
}

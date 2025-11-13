import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

export interface IProductCard {
	className?: string;
	name: string;
	description?: string;
	businessName: string;
	price?: number;
	rating?: number;
	translator?: any;
	id: number;
}

export function ProductCard({ props }: { props: IProductCard }) {
	const { className, name, businessName, price = 0, rating = 0, translator, id } = props;

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 h-full", className)}>
			<div className="relative w-full aspect-square mb-3">
				<Image className="rounded-md object-cover" src={"/placeholder.png"} alt={name} fill unoptimized />
			</div>

			<div className="flex flex-col gap-0.5 mb-2">
				<h4 className="font-semibold text-base line-clamp-2">{name}</h4>
				<p className="text-xs text-muted-foreground">{businessName}</p>
			</div>

			<div className="flex items-center gap-1 mb-3">
				<Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
				<span className="text-sm font-medium">{rating.toFixed(1)}</span>
			</div>

			<div className="mt-auto">
				<p className="text-2xl font-bold mb-3">{price.toFixed(2)}€</p>
				<Link href={`/products/${id}`}>
					<Button className="w-full">{translator("view_product")}</Button>
				</Link>
			</div>
		</article>
	);
}

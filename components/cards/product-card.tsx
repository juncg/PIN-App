import { cn } from "@/lib/utils";
import Image from "next/image";
import { Star, Heart, Tag } from "lucide-react";
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
	const { className, name, description, businessName, price = 0, rating = 0, translator, id } = props;

	return (
		<Link href={`/products/${id}`} className={cn("group block h-full", className)}>
			<article className="flex flex-col h-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
				<div className="relative aspect-square w-full overflow-hidden bg-muted">
					<Image
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
						src={"/placeholder.png"}
						alt={name}
						fill
						unoptimized
					/>

					<button className="absolute left-3 top-3 z-10 rounded-full bg-background/80 p-2 text-foreground backdrop-blur-sm transition-colors hover:bg-background hover:text-red-500">
						<Heart className="h-4 w-4" />
					</button>
				</div>

				<div className="relative flex flex-1 flex-col p-4">
					<div className="mb-1">
						<p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
							{businessName}
						</p>
					</div>

					<h3 className="mb-2 text-lg font-bold leading-tight tracking-tight pr-6">{name}</h3>

					{description && <p className="mb-4 text-xs text-muted-foreground line-clamp-2">{description}</p>}

					<div className="mt-auto flex items-end justify-between">
						<div className="flex items-center gap-1">
							<Star className="h-4 w-4 fill-primary text-primary" />
							<span className="text-sm font-semibold">{rating.toFixed(1)}</span>
							<span className="text-xs text-muted-foreground">
								({Math.floor(Math.random() * 2000)} reviews)
							</span>
						</div>
						<div className="text-xl font-bold">{price.toFixed(2)}€</div>
					</div>
				</div>
			</article>
		</Link>
	);
}

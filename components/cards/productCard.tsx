import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";
import { H3, P } from "../ui/typography";

export interface IProductCard {
	className?: string;
	name: string;
	description: string;
	businessName: string;
}

export function ProductCard({ props }: { props: IProductCard }) {
	const {
		className,
		name,
		description,
		businessName,
	} = props;

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex flex-col gap-2">
					<H3>{name}</H3>
				</div>
			</div>

			<div className="flex flex-col mb-10 gap-4">
				<P>{description}</P>
				<Image className="mx-auto" src={"/placeholder.png"} alt="" width={300} height={600} />
				<P>{businessName}</P>
			</div>

			<div className="flex flex-col gap-8">
				<Button>Entra al producto</Button>
			</div>
		</article>
	);
}

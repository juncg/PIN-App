import { cn } from "@/lib/utils";
import Image from "next/image";
import { H3, P } from "../ui-custom/typography";
import { Button } from "../ui/button";

export interface IBusinessCard {
	className?: string;
	businessName: string;
	businessDescription: string;
}

export function BusinessCard({ props }: { props: IBusinessCard }) {
	const { className, businessName, businessDescription } = props;

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex flex-col gap-2">
					<H3>{businessName}</H3>
				</div>
			</div>
			<div className="flex flex-col mb-10 gap-4">
				<P>{businessDescription}</P>
				<Image className="mx-auto" src={"/placeholder.png"} alt="" width={300} height={600} unoptimized />
			</div>{" "}
			<div className="flex flex-col gap-8">
				<Button>Entra al foro</Button>
			</div>
		</article>
	);
}

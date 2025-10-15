import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { H3, H4, P } from "../ui/typography";

type PostType = "Oferta" | "Petición";

export interface IBusinessCard {
	className?: string;
	productName: string;
	productDescription: string;
	businessName: string;
	typeOfPost: PostType;
	peopleSignedObjective: number;
	peopleSignedCurrent: number;
}

export function BusinessCard({ props }: { props: IBusinessCard }) {
	const {
		className,
		businessName,
		productDescription,
		productName,
		typeOfPost,
		peopleSignedCurrent,
		peopleSignedObjective,
	} = props;

	const offerCompletionPercentage = parseFloat(((peopleSignedCurrent * 100) / peopleSignedObjective).toFixed(2));

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex flex-col gap-2">
					<H3>{productName}</H3>
					<H4>{businessName}</H4>
				</div>

				<div className="flex flex-col gap-2">
					<Badge>{typeOfPost}</Badge>
				</div>
			</div>

			<div className="flex flex-col mb-10 gap-4">
				<P>{productDescription}</P>
				<Image className="mx-auto" src={"/placeholder.png"} alt="" width={300} height={600} />
			</div>

			<div className="flex flex-col gap-8">
				<div className="flex justify-between">
					<Button>Información</Button>
					<Button>Apúntate a la oferta</Button>
				</div>

				<div className="flex flex-col gap-2">
					<Progress value={offerCompletionPercentage} />

					<div className="flex justify-between">
						<H4>
							{peopleSignedCurrent} / {peopleSignedObjective}
						</H4>

						<H4>{offerCompletionPercentage}%</H4>
					</div>
				</div>
			</div>
		</article>
	);
}

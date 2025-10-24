import { cn } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { H3, H4, P } from "../ui/typography";
import {Separator} from "../ui/separator";
import { LikeButton } from "../buttons/like-button";

type PostType = "Oferta" | "Petición";

export interface IPostCard {
	className?: string;
	name: string;
	description: string;
	businessName: string;
	typeOfPost: PostType;
	peopleSignedObjective: number;
	peopleSignedCurrent: number;
	likes: number;
	likedByUser?: boolean;
	id: number;
}

export  function PostCard({ props }: { props: IPostCard }) {
	const {
		className,
		businessName,
		description,
		name,
		typeOfPost,
		peopleSignedCurrent,
		peopleSignedObjective,
		likes,
		likedByUser, 
		id,
	} = props;

	const offerCompletionPercentage = parseFloat(((peopleSignedCurrent * 100) / peopleSignedObjective).toFixed(2));

	return (
		<article className={cn("flex flex-col border border-spacing-2 rounded-lg p-4 gap-4", className)}>
			<div className="flex justify-between items-center border-b pb-4">
				<div className="flex flex-col gap-2">
					<H3>{name}</H3>
					<H4>{businessName}</H4>
				</div>

				<div className="flex flex-col gap-2">
					<Badge>{typeOfPost}</Badge>
				</div>
			</div>

			<div className="flex flex-col mb-10 gap-4">
				<P>{description}</P>
				<Image className="mx-auto" src={"/placeholder.png"} alt="" width={300} height={600} />
			</div>

			<div className="flex flex-col gap-8">
				<div className="flex justify-between">
					<Button>Información</Button>
					{typeOfPost === "Oferta" ? (
						<Button>Apúntate a la oferta</Button>
					) : (
						<Button>Apoya a la petición</Button>
					)}
				</div>

				{typeOfPost === "Oferta" && (
					<div className="flex flex-col gap-2">
						<Progress value={offerCompletionPercentage} />

						<div className="flex justify-between">
							<H4>
								{peopleSignedCurrent} / {peopleSignedObjective}
							</H4>

							<H4>{offerCompletionPercentage}%</H4>
						</div>
					</div>
				)}
				{typeOfPost === "Petición" && (
					<div className="flex flex-col gap-2">
						<Progress value={offerCompletionPercentage} />

						<div className="flex justify-between">
							<H4>
								{peopleSignedCurrent} / {peopleSignedObjective}
							</H4>

							<H4>{offerCompletionPercentage}%</H4>
						</div>
					</div>
				)}
			</div>

			<div className="flex">
				<Separator />
			</div>

			<div className="flex flex-row justify-start">
				<LikeButton props={{ likes, likedByUser, post_id: id }} />
			</div>
		</article>
	);
}

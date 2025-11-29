import { IOffer, IPetition } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Verified } from "lucide-react";
import Image from "next/image";
import { Progress } from "../ui-custom/progress";
import { Switch } from "../ui-custom/switch";
import { H3, H4, P, Small } from "../ui-custom/typography";

interface IPostCardHorizontalProps {
	className?: string;
	post: IOffer | IPetition;
}

export function PostCardHorizontal(props: IPostCardHorizontalProps) {
	const { className, post } = props;

	console.log(post);

	const offerCompletionPercentage = parseFloat(
		((post?.current_progress * 100) / (post?.target_progress ?? 1)).toFixed(2)
	);

	return (
		<article className={cn(className, "flex border-[2px] rounded-[20px] w-full")}>
			<figure className="relative w-60 h-60 rounded-[20px] overflow-hidden shrink-0">
				<Image
					src={post?.images?.[0] || "/placeholder.png"}
					alt={"Post picture"}
					fill
					className="object-cover"
					unoptimized
				/>
			</figure>

			<div className="flex flex-col justify-between p-6 w-full">
				<div className="flex w-full justify-between gap-8">
					<div>
						<H3 className="line-clamp-2">{post.title}</H3>
						<P className="text-muted line-clamp-2">{post.text}</P>
					</div>

					<div className="flex flex-col items-end">
						<H3>120$</H3>
						<P className="line-through text-muted">170$</P>
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Progress value={offerCompletionPercentage} />

						<div className="flex justify-between">
							<H4>
								{post?.current_progress} / {post?.target_progress}
							</H4>

							<H4>{offerCompletionPercentage}%</H4>
						</div>
					</div>

					<div className="flex justify-between">
						<div className="flex gap-2 items-center">
							<figure className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
								<Image
									src={post?.User?.profile_picture || "/placeholder.png"}
									alt={"Creator picture"}
									fill
									className="object-cover"
									unoptimized
								/>
							</figure>

							<span>
								<Small className="text-muted">Creador</Small>
								<P className="flex items-center gap-2">
									@{post?.User?.username || "ejemplo"} <Verified className="h-4" />
								</P>
							</span>
						</div>

						<Switch checked innerTextChecked="Apuntado." disabled />
					</div>
				</div>
			</div>
		</article>
	);
}

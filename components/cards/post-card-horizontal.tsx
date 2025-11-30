import { IOffer, IPetition } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import { Verified } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Progress } from "../ui-custom/progress";
import { Switch } from "../ui-custom/switch";
import { B1, B5, H3, H4 } from "../ui-custom/typography";

interface IPostCardHorizontalProps {
	className?: string;
	post: IOffer | IPetition;
}

export function PostCardHorizontal(props: IPostCardHorizontalProps) {
	const { className, post } = props;

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
						<Link href={`/posts/${post.id}`} className="hover:underline">
							<H3 className="line-clamp-1">{post.title}.</H3>
						</Link>

						<B1 className="text-lightgrey line-clamp-2">{post.text}</B1>
					</div>

					<div className="flex flex-col items-end">
						<H3>120$</H3>
						<B1 className="line-through text-lightgrey">170$</B1>
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
								<B5 className="text-lightgrey">Creador</B5>
								<Link href={`/profile/${post?.User?.id}`} className="hover:underline">
									<B1 className="flex items-center gap-2">
										@{post?.User?.username || "ejemplo"} <Verified className="h-4" />
									</B1>
								</Link>
							</span>
						</div>

						<Switch checked innerTextChecked="Apuntado." disabled />
					</div>
				</div>
			</div>
		</article>
	);
}

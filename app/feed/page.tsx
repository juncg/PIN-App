import { FeedPostCard } from "@/components/cards/feed-post-card";
import { getUserUuid } from "@/lib/services/user";
import { IOffer, IPetition } from "@/lib/services/types";
import { ISearchParams } from "@/types";
import { FeedServices } from "./page-services";

export default async function Feed({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const userUuid = await getUserUuid();
	const { posts } = await FeedServices();

	console.log(posts, userUuid);

	return (
		<div className="container mx-auto max-w-[1800px] px-4 md:px-6 py-6">
			<div className="grid grid-cols-1 lg:grid-cols-[20%_60%_20%] gap-6 lg:gap-8">
				<div className="hidden lg:block space-y-6"></div>

				<div className="space-y-8">
					<div className="space-y-6">
						{posts
							.filter((post) => post.type === "Offer" || post.type === "Petition")
							.map((post) => (
								<FeedPostCard
									key={`${post.type}-${post.id}`}
									post={post as IOffer | IPetition}
									userUuidProp={userUuid}
								/>
							))}
					</div>
				</div>

				<div className="hidden lg:block space-y-6"></div>
			</div>
		</div>
	);
}


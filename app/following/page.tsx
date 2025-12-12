import { FeedPostCard } from "@/components/cards/feed-post-card";
import { BusinessCardHorizontalSmall } from "@/components/cards/business-card-horizontal-small";
import { ForumCardHorizontalSmall } from "@/components/cards/forum-card-horizontal-small";
import { ProductCardHorizontal } from "@/components/cards/product-card-horizontal";
import { getUserUuid } from "@/lib/services/user";
import { IOffer, IPetition, IBusiness, IForum, IProduct } from "@/lib/services/types";
import { ISearchParams } from "@/types";
import { FollowingPageServices } from "./page-services";

export default async function Feed({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const userUuid = await getUserUuid();
	const { posts, businesses, forums, products } = await FollowingPageServices();

	console.log(posts, userUuid);

	return (
		<div className="container mx-auto max-w-[1800px] px-4 md:px-6 py-6">
			<div className="grid grid-cols-1 lg:grid-cols-[20%_50%_30%] gap-6 lg:gap-8">
				<div className="hidden lg:block space-y-6">
					<h3 className="font-semibold text-white">Empresas a las que sigues.</h3>

					{businesses.slice(0, 5).map((business) => (
						<BusinessCardHorizontalSmall key={business.id} business={business as IBusiness} />
					))}

					<h3 className="font-semibold text-white">Foros a los que sigues.</h3>

					{forums.slice(0, 5).map((forum) => (
						<ForumCardHorizontalSmall key={forum.id} forum={forum as IForum} />
					))}
				</div>

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

				<div className="hidden lg:block space-y-6">
					<h3 className="font-semibold text-white">Productos de las empresas a las que sigues.</h3>

					{(products as IProduct[])?.map((product) => (
						<ProductCardHorizontal key={product.id} {...product} />
					))}
				</div>
			</div>
		</div>
	);
}


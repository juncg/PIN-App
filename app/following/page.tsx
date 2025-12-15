import { BusinessCardHorizontalSmall } from "@/components/cards/business-card-horizontal-small";
import { FeedPostCard } from "@/components/cards/feed-post-card";
import { ForumCardHorizontalSmall } from "@/components/cards/forum-card-horizontal-small";
import { ProductCardHorizontal } from "@/components/cards/product-card-horizontal";
import { B1 } from "@/components/ui-custom/typography";
import { IBusiness, IForum, IOffer, IPetition, IProduct } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { ISearchParams } from "@/types";
import { FollowingPageServices } from "./page-services";

export default async function Feed({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	const userUuid = await getUserUuid();
	const { posts, businesses, forums, products } = await FollowingPageServices();

	return (
		<div className="container mx-auto max-w-[1800px] pr-3 py-6">
			<div className="grid grid-cols-1 lg:grid-cols-[20%_50%_25%] gap-6 lg:gap-8">
				<div className="hidden lg:block space-y-6">
					<B1>Empresas a las que sigues.</B1>

					{businesses.slice(0, 5).map((business: IBusiness) => (
						<BusinessCardHorizontalSmall key={business.id} business={business} />
					))}

					<B1>Foros a los que sigues.</B1>

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
					<B1>Productos de las empresas a las que sigues.</B1>

					{(products as IProduct[])?.map((product) => (
						<ProductCardHorizontal key={product.id} {...product} />
					))}
				</div>
			</div>
		</div>
	);
}

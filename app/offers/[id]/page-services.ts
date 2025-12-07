import { GetFromDatabase } from "@/lib/services/general";
import { IOffer, IProduct, IUser } from "@/lib/services/types";
import { fetchTopLevelComments } from "../../shared-services/post-shared-services";

export async function OfferDetailsService(id: number, userUuid: string) {
	const { data: offer } = await GetFromDatabase<IOffer>({
		tableName: "Offer",
		select: `*, User!Offer_creator_id_fkey(*), User_Offer!left(liked, subscribed, user_id), tags:Offer_Tag(Tag(name)), products:Offer_Product(Product(*, businesses:Product_Business(business:Business(*))))`,
		filters: [{ method: "eq", column: "id", value: id }],
	});

	const { comments } = await fetchTopLevelComments(id, "offer");

	const currentUser =
		userUuid && userUuid.trim() !== ""
			? await GetFromDatabase<IUser>({
					tableName: "User",
					select: "*",
					filters: [{ method: "eq", column: "id", value: userUuid }],
			  })
			: null;

	const offerProducts = offer?.[0]?.products || [];
	const businessId = offerProducts?.[0]?.Product?.businesses?.[0]?.business?.id;

	let businessProducts: IProduct[] = [];

	if (businessId) {
		const { data } = await GetFromDatabase<IProduct>({
			tableName: "Product",
			select: "*, businesses:Product_Business!inner(business:Business(*)), Review_Product(review_id)",
			filters: [
				{
					method: "eq",
					column: "Product_Business.business_id",
					value: businessId,
				},
				{ method: "order", column: "created_at", ascending: false },
				{ method: "limit", value: 5 },
			],
		});

		businessProducts = data || [];
	}

	return {
		offer,
		comments,
		currentUser: currentUser?.data?.[0] || null,
		businessProducts,
	};
}

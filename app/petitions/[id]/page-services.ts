import { Tables } from "@/database.types";
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition, IComment, IUser, IProduct } from "@/lib/services/types";
import { fetchTopLevelComments } from "../../shared-services/post-shared-services";

export async function PetitionDetailsService(id: number, userUuid: string) {
	const { data: petition } = await GetFromDatabase<IPetition>({
		tableName: "Petition",
		select: `*, User!Petition_creator_id_fkey(*), User_Petition!left(liked, subscribed, user_id), tags:Petition_Tag(Tag(name)), products:Petition_Product(Product(*, businesses:Product_Business(business:Business(*))))`,
		filters: [{ method: "eq", column: "id", value: id }],
	});

	const { comments, error } = await fetchTopLevelComments(id, "petition");

	const currentUser =
		userUuid && userUuid.trim() !== ""
			? await GetFromDatabase<IUser>({
					tableName: "User",
					select: "*",
					filters: [{ method: "eq", column: "id", value: userUuid }],
			  })
			: null;

	const petitionProducts = petition?.[0]?.products || [];
	const businessId = petitionProducts?.[0]?.Product?.businesses?.[0]?.business?.id;

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

	return { petition, comments, currentUser: currentUser?.data?.[0] || null, businessProducts };
}

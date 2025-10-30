import CreateOfferForm from "@/components/forms/create-offer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user.server";

export default async function Page() {
	const forumsResult = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*",
	});

	const tagsResult = await GetFromDatabase<{ id: number; name: string }>({
		tableName: "Tag",
		select: "*",
	});

	const userId = await getUserUuid();

	console.log(userId);

	const forums = Array.isArray(forumsResult) ? forumsResult : [];
	const tags = Array.isArray(tagsResult) ? tagsResult : [];

	return (
		<div className="flex flex-center flex-col gap-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Crear una oferta</CardTitle>
					<CardDescription>Introduce todos los datos para crear una nueva oferta</CardDescription>
				</CardHeader>
				<CardContent>
					<CreateOfferForm forums={forums} userId={userId} tags={tags} />
				</CardContent>
			</Card>
		</div>
	);
}

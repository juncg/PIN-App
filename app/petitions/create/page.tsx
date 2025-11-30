import CreatePetitionForm from "@/components/forms/create-petition-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { GetFromDatabase } from "@/lib/services/general";
import { IForum } from "@/lib/services/types";

export default async function Page() {
	const forums = await GetFromDatabase<IForum>({
		tableName: "Forum",
		select: "*",
	});

	const tags = await GetFromDatabase<{ id: number; name: string }>({
		tableName: "Tag",
		select: "*",
	});

	return (
		<div className="flex flex-center flex-col gap-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Crear una petición</CardTitle>
					<CardDescription>Introduce todos los datos para crear una nueva petición</CardDescription>
				</CardHeader>

				<CardContent>
					<CreatePetitionForm forums={forums.data ?? []} tags={tags.data ?? []} />
				</CardContent>
			</Card>
		</div>
	);
}

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
		<div className="flex flex-col items-center gap-8 py-8">
			<Card className="w-full  max-w-4xl">
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

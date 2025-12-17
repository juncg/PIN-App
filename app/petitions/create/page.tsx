import CreatePetitionForm from "@/components/forms/create-petition-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { CreatePetitionServices } from "./page-services";
import { ISearchParams } from "@/types";

interface CreatePetitionPageProps {
	searchParams: Promise<ISearchParams>;
}

export default async function Page({ searchParams }: CreatePetitionPageProps) {
	const params = await searchParams;
	const productId = params.productId;

	const { forums, tags, initialProduct } = await CreatePetitionServices(productId);

	return (
		<div className="flex flex-col items-center gap-8 py-8">
			<Card className="w-full  max-w-4xl">
				<CardHeader>
					<CardTitle className="text-2xl">Crear una petición</CardTitle>
					<CardDescription>Introduce todos los datos para crear una nueva petición</CardDescription>
				</CardHeader>

				<CardContent>
					<CreatePetitionForm forums={forums.data ?? []} tags={tags.data ?? []} initialProducts={initialProduct ? [initialProduct] : []} />
				</CardContent>
			</Card>
		</div>
	);
}

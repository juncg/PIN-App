import CreateOfferForm from "@/components/forms/create-offer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { CreateOfferServices } from "./page-services";

export default async function Page() {
	const { forums, tags } = await CreateOfferServices();

	return (
		<div className="flex flex-center flex-col gap-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Crear una oferta</CardTitle>
					<CardDescription>Introduce todos los datos para crear una nueva oferta</CardDescription>
				</CardHeader>

				<CardContent>
					<CreateOfferForm forums={forums.data || []} tags={tags.data || []} />
				</CardContent>
			</Card>
		</div>
	);
}

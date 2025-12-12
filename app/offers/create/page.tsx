import CreateOfferForm from "@/components/forms/create-offer-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { CreateOfferServices } from "./page-services";
import { getUserUuid } from "@/lib/services/user";

export default async function Page() {
	const { forums, tags, businesses } = await CreateOfferServices();

	return (
		<div className="flex flex-col items-center gap-8 py-8">
			<Card className="w-full  max-w-4xl bg-darkmode">
				<CardHeader>
					<CardTitle className="text-2xl">Crear una oferta</CardTitle>
					<CardDescription>Introduce todos los datos para crear una nueva oferta</CardDescription>
				</CardHeader>

				<CardContent>
					<CreateOfferForm forums={forums.data || []} tags={tags.data || []} businesses={businesses} />
				</CardContent>
			</Card>
		</div>
	);
}


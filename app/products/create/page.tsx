import CreateProductForm from "@/components/forms/create-product-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { CreateProductServices } from "./page-services";

export default async function Page() {
	const { businesses, categories } = await CreateProductServices();

	return (
		<div className="flex flex-col items-center gap-8 py-8">
			<Card className="w-full max-w-4xl bg-darkmode">
				<CardHeader>
					<CardTitle className="text-2xl">Crear un producto</CardTitle>
					<CardDescription>Introduce todos los datos para crear un nuevo producto</CardDescription>
				</CardHeader>

				<CardContent>
					<CreateProductForm businesses={businesses} categories={categories} />
				</CardContent>
			</Card>
		</div>
	);
}
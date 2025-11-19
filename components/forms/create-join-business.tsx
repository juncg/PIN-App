"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { IBusiness, IBusinessEmployee } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { Alert, IAlert } from "../ui-custom/alert";
import { FormField } from "./base/form-field";
import { CreateOfferSchema, type TCreateOfferSchema } from "./schemas/business";

export default function CreateJoinBusinessForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alert, setAlert] = useState<IAlert | null>(null);
	const [apiError, setApiError] = useState<any | null>(null);
	const { userUuid } = useUser();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TCreateOfferSchema>({
		resolver: zodResolver(CreateOfferSchema),
		mode: "onBlur",
		defaultValues: {
			name: "",
			description: "",
		},
	});

	async function handleBusinessCreation(data: TCreateOfferSchema) {
		setIsSubmitting(true);
		setAlert(null);
		setApiError(null);

		if (!userUuid) {
			setAlert({ type: "Error", message: "Debes iniciar sesión para crear o vincular una empresa." });
			setIsSubmitting(false);
			return;
		}

		try {
			const newBusiness: Partial<IBusiness> = {
				name: data.name,
				description: data.description,
				created_at: new Date().toISOString(),
				owner_id: userUuid,
			};



			const response = await PostToDatabase<IBusiness>({
				tableName: "Business",
				contentJson: [newBusiness],
			});

			if (response.error) {
				setApiError(response.error);
				setIsSubmitting(false);
				return;
			}

			const inserted = response.data;
			const businessId = inserted?.[0]?.id;

			const newBusinessEmployee: Partial<IBusinessEmployee> = { //creating BusinessUser   
				user_id: userUuid,
				business_id: businessId,
				created_at: new Date().toISOString()


			};

			const responseBusinessEmployee = await PostToDatabase<IBusinessEmployee>({
				tableName: "Business_Employee",
				contentJson: [newBusinessEmployee],
			});

			if (responseBusinessEmployee.error) {
				setApiError(responseBusinessEmployee.error);
				setIsSubmitting(false);
				return;
			}

			setAlert({ type: "Success", message: "Empresa creada correctamente y perfil upgradeado PROVISIONAL" });

			// navigate to the newly created business page if available, otherwise to list

		} catch (error) {
			console.error("Error creating business:", error);
			setAlert({ type: "Error", message: "Error al crear la empresa. Inténtalo de nuevo." });
		} finally {
			reset({ name: "", description: "" });
			setIsSubmitting(false);
		}
	}

	return (
		<>
			{alert && <Alert message={alert.message} type={alert.type} />}

			<APIErrorHandler error={apiError} />

			<form className="flex flex-col gap-6" onSubmit={handleSubmit(handleBusinessCreation)}>
				<FormField label="Nombre de la empresa" errorMessage={errors.name?.message || ""} htmlFor="name" required>
					<Input id="name" type="text" {...register("name")} disabled={isSubmitting} />
				</FormField>

				<FormField
					label="Descripción"
					errorMessage={errors.description?.message || ""}
					htmlFor="description"
					required
				>
					<Textarea id="description" className="h-28" {...register("description")} disabled={isSubmitting} />
				</FormField>

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creando..." : "Crear Empresa"}
				</Button>
			</form>
		</>
	)
}
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { IBusiness, IBusinessEmployee } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { FormField } from "./base/form-field";
import { CreateBusinessSchema, TCreateBusinessSchema } from "./schemas/business";

export default function CreateJoinBusinessForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alert, setAlert] = useState<IAlert | null>(null);
	const [apiError, setApiError] = useState<any | null>(null);
	const { userUuid } = useUser();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TCreateBusinessSchema>({
		resolver: zodResolver(CreateBusinessSchema),
		mode: "onBlur",
		defaultValues: {
			name: "",
			description: "",
		},
	});

	async function handleBusinessCreation(data: TCreateBusinessSchema) {
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

			const newBusinessEmployee: Partial<IBusinessEmployee> = {
				user_id: userUuid,
				business_id: businessId,
				created_at: new Date().toISOString(),
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
			<Button
				variant="outline"
				onClick={() =>
					toast("Event has been created", {
						description: "Sunday, December 03, 2023 at 9:00 AM",
					})
				}
			>
				Show Toast
			</Button>

			{alert && (
				<Button
					variant="outline"
					onClick={() =>
						toast("Event has been created", {
							description: "Sunday, December 03, 2023 at 9:00 AM",
							action: {
								label: "Undo",
								onClick: () => console.log("Undo"),
							},
						})
					}
				>
					Show Toast
				</Button>
			)}

			<APIErrorHandler error={apiError} />

			<form className="flex flex-col gap-6" onSubmit={handleSubmit(handleBusinessCreation)}>
				<FormField
					label="Nombre de la empresa"
					errorMessage={errors.name?.message || ""}
					htmlFor="name"
					required
				>
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
	);
}

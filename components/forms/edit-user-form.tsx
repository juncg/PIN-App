"use client";

import { Button } from "@/components/ui-custom/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui-custom/dialog";
import { Input } from "@/components/ui-custom/input";
import { Textarea } from "@/components/ui-custom/textarea";
import { PutToDatabase } from "@/lib/services/general";
import { IUser } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { FormField } from "./base/form-field";
import { EditUserSchema, type TEditUserSchema } from "./schemas/user";

interface EditUserFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userData: IUser;
}

export default function EditUserForm({ open, onOpenChange, userData }: EditUserFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<any>(null);
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<TEditUserSchema>({
		resolver: zodResolver(EditUserSchema),
		defaultValues: {
			name: userData.name || "",
			surnames: userData.surnames || "",
			bio: userData.bio || "",
		},
	});

	const onSubmit = async (data: TEditUserSchema) => {
		setIsSubmitting(true);
		setApiError(null);

		try {
			const updateData = {
				name: data.name,
				surnames: data.surnames,
				bio: data.bio || null,
			};

			const result = await PutToDatabase<IUser>({
				tableName: "User",
				contentJson: updateData,
				filters: [{ method: "eq", column: "id", value: userData.id }],
			});

			if (result.error) {
				setApiError(result.error);
				return;
			}

			toast.success("Perfil actualizado correctamente");
			onOpenChange(false);
			router.refresh();
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Error al actualizar el perfil");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (newOpen: boolean) => {
		if (!newOpen) {
			reset();
		}
		onOpenChange(newOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Editar perfil</DialogTitle>
					<DialogDescription>
						Actualiza tu información básica. Haz clic en guardar cuando termines.
					</DialogDescription>
				</DialogHeader>

				<APIErrorHandler error={apiError} />

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<FormField label="Nombre" errorMessage={errors.name?.message || ""} htmlFor="name" required>
						<Input
							id="name"
							type="text"
							{...register("name")}
							disabled={isSubmitting}
						/>
					</FormField>

					<FormField label="Apellidos" errorMessage={errors.surnames?.message || ""} htmlFor="surnames" required>
						<Input
							id="surnames"
							type="text"
							{...register("surnames")}
							disabled={isSubmitting}
						/>
					</FormField>

					<FormField label="Biografía" errorMessage={errors.bio?.message || ""} htmlFor="bio">
						<Textarea
							id="bio"
							rows={3}
							{...register("bio")}
							disabled={isSubmitting}
							placeholder="Cuéntanos sobre ti..."
						/>
					</FormField>

					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Guardando..." : "Guardar cambios"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
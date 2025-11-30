"use client";

import { Button } from "@/components/ui-custom/button";
import { Card } from "@/components/ui-custom/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-custom/select";
import { Textarea } from "@/components/ui-custom/textarea";
import { Tables } from "@/database.types";
import { PostToDatabase } from "@/lib/services/general";
import { compressImage, uploadImage } from "@/lib/services/media-upload";
import { IBusiness } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { Input } from "../ui-custom/input";
import FileDropzone from "./base/file-dropzone";
import { FormField } from "./base/form-field";
import { forumSchema, type ForumFormData } from "./schemas/forum";

interface CreateForumFormProps {
	businesses: IBusiness[];
	onSuccess?: () => void;
}

export function CreateForumForm({ businesses, onSuccess }: CreateForumFormProps) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<PostgrestError | null>(null);
	const [profilePicture, setProfilePicture] = useState<File[]>([]);
	const [banner, setBanner] = useState<File[]>([]);
	const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<ForumFormData>({
		resolver: zodResolver(forumSchema),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			name: "",
			description: "",
		},
	});

	async function handleForumCreation(data: ForumFormData) {
		if (!selectedBusinessId) {
			toast.error("Por favor selecciona una empresa");
			return;
		}

		setIsSubmitting(true);
		setApiError(null);

		try {
			let profilePictureUrl: string | null = null;
			if (profilePicture.length > 0) {
				const compressedFile = await compressImage(profilePicture[0]);
				const url = await uploadImage(compressedFile);
				if (url) profilePictureUrl = url;
			}

			let bannerUrl: string | null = null;
			if (banner.length > 0) {
				const compressedFile = await compressImage(banner[0]);
				const url = await uploadImage(compressedFile);
				if (url) bannerUrl = url;
			}

			const newForum: Omit<Tables<"Forum">, "id"> = {
				name: data.name,
				description: data.description,
				business_id: selectedBusinessId,
				profile_picture: profilePictureUrl,
				banner: bannerUrl,
				allows_custom_tags: true,
				created_at: new Date().toISOString(),
				followers: 0,
			};

			const response = await PostToDatabase({
				tableName: "Forum",
				contentJson: [newForum],
			});

			if (response.error) {
				setApiError(response.error);
				return;
			}

			toast.success("¡Foro creado exitosamente!");

			reset();
			setProfilePicture([]);
			setBanner([]);
			setSelectedBusinessId(null);

			if (onSuccess) {
				onSuccess();
			}

			if (response.data && response.data.length > 0) {
				router.push(`/forums/${response.data[0].id}`);
			}
		} catch (error) {
			console.error("Error creating forum:", error);
			toast.error(error instanceof Error ? error.message : "Error al crear el foro");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<APIErrorHandler error={apiError} />

			<Card className="p-6">
				<form onSubmit={handleSubmit(handleForumCreation)} className="space-y-6">
					<FormField
						label="Nombre del foro"
						errorMessage={errors.name?.message || ""}
						htmlFor="name"
						required
					>
						<Input
							id="name"
							type="text"
							placeholder="Ej: Comunidad de Tecnología"
							{...register("name")}
							disabled={isSubmitting}
						/>
					</FormField>

					<FormField
						label="Descripción"
						errorMessage={errors.description?.message || ""}
						htmlFor="description"
						required
					>
						<Textarea
							id="description"
							placeholder="Describe de qué trata este foro..."
							rows={4}
							{...register("description")}
							disabled={isSubmitting}
						/>
					</FormField>

					<FormField
						label="Empresa"
						errorMessage={selectedBusinessId === null ? "Debes seleccionar una empresa" : ""}
						htmlFor="business"
						required
					>
						<Select
							value={selectedBusinessId?.toString()}
							onValueChange={(value) => setSelectedBusinessId(parseInt(value))}
							disabled={isSubmitting}
						>
							<SelectTrigger id="business">
								<SelectValue placeholder="Selecciona una empresa" />
							</SelectTrigger>
							<SelectContent>
								{businesses.map((business) => (
									<SelectItem key={business.id} value={business.id.toString()}>
										{business.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormField>

					<FormField
						label="Foto de perfil"
						errorMessage={errors.profile_picture?.message || ""}
						htmlFor="profile_picture"
					>
						<FileDropzone
							value={profilePicture}
							onChange={setProfilePicture}
							maxFiles={1}
							disabled={isSubmitting}
						/>
						{profilePicture.length > 0 && (
							<p className="text-sm text-lightgrey mt-1">
								Archivo seleccionado: {profilePicture[0].name}
							</p>
						)}
					</FormField>

					<FormField label="Banner" errorMessage={errors.banner?.message || ""} htmlFor="banner">
						<FileDropzone
							value={banner}
							onChange={setBanner}
							accept="image/*"
							maxFiles={1}
							disabled={isSubmitting}
						/>
						{banner.length > 0 && (
							<p className="text-sm text-lightgrey mt-1">Archivo seleccionado: {banner[0].name}</p>
						)}
					</FormField>

					<Button type="submit" disabled={isSubmitting} className="w-full">
						{isSubmitting ? "Creando foro..." : "Crear foro"}
					</Button>
				</form>
			</Card>
		</>
	);
}

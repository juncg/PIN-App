"use client";

import { Button } from "@/components/ui-custom/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-custom/select";
import { Tables } from "@/database.types";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { compressImage, uploadImage } from "@/lib/services/media-upload";
import { IProduct } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { Input } from "../ui-custom/input";
import { Textarea } from "../ui-custom/textarea";
import FileDropzone from "./base/file-dropzone";
import { FormField } from "./base/form-field";
import { CreateProductSchema, type TCreateProductSchema } from "./schemas/product";

interface CreateProductFormProps {
	businesses: { id: number; name: string | null }[];
	categories: { id: number; name: string | null }[];
}

export default function CreateProductForm({ businesses, categories }: CreateProductFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [apiError, setApiError] = useState<PostgrestError | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const { userUuid } = useUser();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<TCreateProductSchema>({
		resolver: zodResolver(CreateProductSchema),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			name: "",
			description: "",
			msrp: undefined,
			business_id: undefined,
			category_id: undefined,
		},
	});

	const businessId = watch("business_id");
	const categoryId = watch("category_id");

	async function handleProductCreation(data: TCreateProductSchema) {
		setIsSubmitting(true);
		setApiError(null);

		const uploadedUrls: string[] = [];
		for (const file of images) {
			const compressedFile = await compressImage(file);
			const url = await uploadImage(compressedFile);
			if (url) uploadedUrls.push(url);
		}

		try {
			const newProduct: Omit<Tables<"Product">, "id"> = {
				name: data.name,
				description: data.description,
				msrp: data.msrp,
				images: uploadedUrls.length > 0 ? uploadedUrls : null,
				associated_links: null,
				rating: null,
				created_at: new Date().toISOString(),
			};

			const response = await PostToDatabase<IProduct>({
				tableName: "Product",
				contentJson: [newProduct],
			});

			if (response.error) {
				setIsSubmitting(false);
				setApiError(response.error);
				return;
			}

			const inserted = response.data;
			const productId = inserted?.[0]?.id;

			if (productId) {
				// Insert into Product_Business
				const businessRelation = {
					product_id: productId,
					business_id: data.business_id,
				};

				const businessResp = await PostToDatabase({
					tableName: "Product_Business",
					contentJson: [businessRelation],
				});

				if (businessResp.error) {
					setIsSubmitting(false);
					setApiError(businessResp.error);
					return;
				}

				// Insert into Product_Category if category selected
				if (data.category_id) {
					const categoryRelation = {
						product_id: productId,
						category_id: data.category_id,
					};

					const categoryResp = await PostToDatabase({
						tableName: "Product_Category",
						contentJson: [categoryRelation],
					});

					if (categoryResp.error) {
						setIsSubmitting(false);
						setApiError(categoryResp.error);
						return;
					}
				}
			}

			toast.success("Producto creado exitosamente");
			router.push("/products");
		} catch (error) {
			console.error("Error creating product:", error);
			toast.error("Error al crear el producto");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<APIErrorHandler error={apiError} />

			<form onSubmit={handleSubmit(handleProductCreation)} className="space-y-6">
				<FormField label="Nombre del producto" errorMessage={errors.name?.message || ""} htmlFor="name" required>
					<Input
						id="name"
						type="text"
						variant="squared"
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
					<Textarea className="h-40" id="description" {...register("description")} disabled={isSubmitting} />
				</FormField>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<FormField
						label="Precio (MSRP)"
						errorMessage={errors.msrp?.message || ""}
						htmlFor="msrp"
						required
					>
						<Input
							id="msrp"
							type="number"
							step="0.01"
							min="0"
							{...register("msrp", { valueAsNumber: true })}
							disabled={isSubmitting}
						/>
					</FormField>

					<FormField
						label="Negocio"
						htmlFor="business_id"
						errorMessage={errors.business_id?.message}
						required
					>
						<Select
							value={businessId?.toString() || ""}
							onValueChange={(value) => setValue("business_id", Number(value))}
							disabled={isSubmitting}
						>
							<SelectTrigger id="business_id">
								<SelectValue placeholder="Selecciona un negocio" />
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
				</div>

				<FormField label="Categoría" htmlFor="category_id" errorMessage={errors.category_id?.message}>
					<Select
						value={categoryId?.toString() || ""}
						onValueChange={(value) => setValue("category_id", value ? Number(value) : undefined)}
						disabled={isSubmitting}
					>
						<SelectTrigger id="category_id">
							<SelectValue placeholder="Selecciona una categoría (opcional)" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((category) => (
								<SelectItem key={category.id} value={category.id.toString()}>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>

				<FormField label="Imágenes" htmlFor="images">
					<FileDropzone value={images} onChange={setImages} maxFiles={10} disabled={isSubmitting} />
				</FormField>

				<div className="flex justify-end pt-6">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creando..." : "Crear Producto"}
					</Button>
				</div>
			</form>
		</>
	);
}
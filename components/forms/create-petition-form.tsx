"use client";

import { SelectTags } from "@/components/select/select-tags";
import { Button } from "@/components/ui-custom/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui-custom/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui-custom/tabs";
import { Progress } from "@/components/ui-custom/progress";
import { Badge } from "@/components/ui-custom/badge";
import { Tables } from "@/database.types";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase, ExecuteRpcFunction } from "@/lib/services/general";
import { compressImage, uploadImage } from "@/lib/services/media-upload";
import { IForum, IPetition } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { Input } from "../ui-custom/input";
import { Switch } from "../ui-custom/switch";
import { Textarea } from "../ui-custom/textarea";
import FileDropzone from "./base/file-dropzone";
import { FormField } from "./base/form-field";
import { CreatePetitionSchema, type TCreatePetitionSchema } from "./schemas/petition";
import { IProduct } from "@/lib/services/types";
import { ProductSelector } from "./product-selector";
import { toast } from "sonner";
import { Card } from "../ui-custom/card";
import { B1, H3 } from "../ui-custom/typography";

interface CreatePetitionFormProps {
	forums: IForum[];
	tags: { id: number; name: string }[];
}

export default function CreatePetitionForm({ forums, tags }: CreatePetitionFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [apiError, setApiError] = useState<PostgrestError | null>(null);
	const [images, setImages] = useState<File[]>([]);
	const [selectedProductsList, setSelectedProductsList] = useState<IProduct[]>([]);
	const [totalMsrp, setTotalMsrp] = useState<number>(0);
	const { userUuid } = useUser();
	const router = useRouter();

	const [currentStep, setCurrentStep] = useState<number>(1);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		trigger,
	} = useForm<TCreatePetitionSchema>({
		resolver: zodResolver(CreatePetitionSchema),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			title: "",
			text: "",
			target_progress: undefined,
			comment_locked_state: "Unlocked",
			forum_id: undefined,
			state: "Posted",
			product_ids: [],
			reduced_price: null,
		},
	});

	const forumId = watch("forum_id");
	const allowComments = watch("comment_locked_state") === "Unlocked";
	const reducedPrice = watch("reduced_price");

	useEffect(() => {
		const total = selectedProductsList.reduce((sum, product) => sum + (product.msrp || 0), 0);
		setTotalMsrp(total);
		setValue(
			"product_ids",
			selectedProductsList.map((p) => p.id)
		);

		if (selectedProductsList.length === 0) {
			setValue("reduced_price", null);
		}
	}, [selectedProductsList, setValue]);

	const handleNext = async () => {
		let fieldsToValidate: (keyof TCreatePetitionSchema)[] = [];

		if (currentStep === 1) {
			fieldsToValidate = ["title", "text", "forum_id", "comment_locked_state"];
		} else if (currentStep === 2) {
			fieldsToValidate = ["target_progress"];
		}

		const isValid = await trigger(fieldsToValidate);

		if (isValid) {
			setCurrentStep((prev) => Math.min(prev + 1, 3));
		}
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleFormSubmit = async () => {
		if (currentStep === 3) {
			await handleSubmit(handlePetitionCreation)();
		}
	};

	async function handlePetitionCreation(data: TCreatePetitionSchema) {
		setIsSubmitting(true);
		setApiError(null);

		if (selectedProductsList.length > 0) {
			if (!data.reduced_price) {
				toast.error("Debes especificar un precio reducido para los productos seleccionados");
				setIsSubmitting(false);
				return;
			}

			if (data.reduced_price >= totalMsrp) {
				toast.error("El precio reducido debe ser menor que el precio total de los productos");
				setIsSubmitting(false);
				return;
			}
		}

		const uploadedUrls: string[] = [];
		for (const file of images) {
			const compressedFile = await compressImage(file);
			const url = await uploadImage(compressedFile);
			if (url) uploadedUrls.push(url);
		}

		try {
			const newPetition: Omit<Tables<"Petition">, "id"> = {
				title: data.title,
				text: data.text,
				target_progress: data.target_progress,
				created_at: new Date().toISOString(),
				creator_id: userUuid,
				current_progress: 0,
				comment_locked_state: data.comment_locked_state ?? "Unlocked",
				forum_id: data.forum_id,
				likes: 0,
				superlikes: 0,
				state: data.state ?? "Posted",
				images: uploadedUrls.length > 0 ? uploadedUrls : null,
				reduced_price: selectedProductsList.length > 0 ? (data.reduced_price as number) : null,
			};

			const response = await PostToDatabase<IPetition>({
				tableName: "Petition",
				contentJson: [newPetition],
			});

			if (response.error) {
				setIsSubmitting(false);
				setApiError(response.error);
				return;
			}

			const inserted = response.data;
			const petitionId = inserted?.[0]?.id;

			if (petitionId && selectedTags.length > 0) {
				const tagRelations = selectedTags.map((tagId) => ({
					petition_id: petitionId,
					tag_id: tagId,
				}));

				const tagResp = await PostToDatabase({
					tableName: "Petition_Tag",
					contentJson: tagRelations,
				});

				if (tagResp.error) {
					setIsSubmitting(false);
					setApiError(tagResp.error);
					return;
				}
			}

			if (petitionId && selectedProductsList.length > 0) {
				const productRelations = selectedProductsList.map((product) => ({
					petition_id: petitionId,
					product_id: product.id,
				}));

				const productResp = await PostToDatabase({
					tableName: "Petition_Product",
					contentJson: productRelations,
				});

				if (productResp.error) {
					setIsSubmitting(false);
					setApiError(productResp.error);
					return;
				}
			}

			await ExecuteRpcFunction({
				functionName: "update_tag_usage",
				params: {
					tag_ids: selectedTags,
				},
			});

			router.push("/posts");
		} catch (error) {
			console.error("Error creating petition:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<APIErrorHandler error={apiError} />

			<div className="space-y-6">
				<Progress value={((currentStep - 1) / 2) * 100} className="h-2" />

				<Tabs value={`step${currentStep}`} className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="step1" disabled>
							<span className="ml-2">Información básica</span>
						</TabsTrigger>
						<TabsTrigger value="step2" disabled>
							<span className="ml-2">Objetivo y Media</span>
						</TabsTrigger>
						<TabsTrigger value="step3" disabled>
							<span className="ml-2">Productos</span>
						</TabsTrigger>
					</TabsList>

					<TabsContent value="step1" className="space-y-6 mt-6">
						<FormField label="Título" errorMessage={errors.title?.message || ""} htmlFor="title" required>
							<Input id="title" type="text" {...register("title")} disabled={isSubmitting} />
						</FormField>

						<FormField
							label="Descripción"
							errorMessage={errors.text?.message || ""}
							htmlFor="text"
							required
						>
							<Textarea className="h-40" id="text" {...register("text")} disabled={isSubmitting} />
						</FormField>

						<div className="flex justify-between gap-6">
							<FormField
								label="Foro asociado"
								htmlFor="forum_id"
								errorMessage={errors.forum_id?.message}
								required
							>
								<Select
									value={forumId?.toString() || ""}
									onValueChange={(value) => setValue("forum_id", Number(value))}
									disabled={isSubmitting}
								>
									<SelectTrigger id="forum_id">
										<SelectValue placeholder="Selecciona un foro" />
									</SelectTrigger>
									<SelectContent>
										{forums.map((forum) => (
											<SelectItem key={forum.id} value={forum.id.toString()}>
												{forum.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormField>

							<FormField label="Permitir comentarios" htmlFor="allow_comments" required>
								<Switch
									id="allow_comments"
									checked={allowComments}
									onCheckedChange={(checked) =>
										setValue("comment_locked_state", checked ? "Unlocked" : "Locked")
									}
									disabled={isSubmitting}
									innerTextChecked="Activado."
									innerTextUnchecked="Desactivado"
								/>
							</FormField>
						</div>
						<FormField label="" htmlFor="images">
							<FileDropzone value={images} onChange={setImages} maxFiles={5} disabled={isSubmitting} />
						</FormField>
					</TabsContent>

					<TabsContent value="step2" className="space-y-6 mt-6">
						<FormField
							label="Objetivo numérico"
							errorMessage={errors.target_progress?.message || ""}
							htmlFor="target_progress"
							required
						>
							<Input
								id="target_progress"
								type="number"
								{...register("target_progress", { valueAsNumber: true })}
								disabled={isSubmitting}
							/>
						</FormField>

						<FormField label="Tags" htmlFor="tags">
							<SelectTags
								availableTags={tags}
								selectedTags={selectedTags}
								onTagsChange={setSelectedTags}
								placeholder="Selecciona los tags para la petición"
								disabled={isSubmitting}
							/>
						</FormField>
					</TabsContent>

					<TabsContent value="step3" className="space-y-6 mt-6">
						<FormField label="Productos asociados" htmlFor="products">
							<ProductSelector
								selectedProducts={selectedProductsList}
								onProductsChange={setSelectedProductsList}
								restrictToUserBusinesses={false}
							/>

							{selectedProductsList.length > 0 && (
								<Card className="p-4 bg-primary/5 border border-input mt-4">
									<div className="flex justify-between items-center mb-3">
										<H3>Precio total:</H3>
										<H3 className="text-primary">{totalMsrp.toFixed(2)}€</H3>
									</div>

									<FormField
										label="Precio reducido de la petición"
										errorMessage={errors.reduced_price?.message || ""}
										htmlFor="reduced_price"
										required
									>
										<Input
											id="reduced_price"
											type="number"
											step="0.01"
											min="0"
											max={totalMsrp}
											{...register("reduced_price", { valueAsNumber: true })}
											disabled={isSubmitting}
											placeholder={`Debe ser menor a ${totalMsrp.toFixed(2)}€`}
										/>
									</FormField>

									{reducedPrice !== null && reducedPrice !== undefined && totalMsrp > 0 && (
										<div className="mt-3 text-center">
											<B1 className="text-primary font-semibold">
												Descuento: {(((totalMsrp - reducedPrice) / totalMsrp) * 100).toFixed(1)}
												%
											</B1>
										</div>
									)}
								</Card>
							)}
						</FormField>
					</TabsContent>
				</Tabs>

				<div className="flex justify-between pt-6">
					<Button
						type="button"
						variant="outline"
						onClick={handlePrevious}
						disabled={currentStep === 1 || isSubmitting}
					>
						Anterior
					</Button>
					<Button
						type="button"
						onClick={currentStep === 3 ? handleFormSubmit : handleNext}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Creando..." : currentStep === 3 ? "Crear Petición" : "Siguiente"}
					</Button>
				</div>
			</div>
		</>
	);
}

"use client";

import { SelectTags } from "@/components/select/select-tags";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tables } from "@/database.types";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { compressImage, uploadImage } from "@/lib/services/media-upload";
import { IForum, IOffer } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { type PostgrestError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { DateInput } from "../ui-custom/date-input";
import { Input } from "../ui-custom/input";
import { Switch } from "../ui-custom/switch";
import { Textarea } from "../ui/textarea";
import FileDropzone from "./base/file-dropzone";
import { FormField } from "./base/form-field";
import { CreateOfferSchema, type TCreateOfferSchema } from "./schemas/offer";

interface OfferFormProps {
	forums: IForum[];
	tags: { id: number; name: string }[];
}

export default function OfferForm({ forums, tags }: OfferFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
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
	} = useForm<TCreateOfferSchema>({
		resolver: zodResolver(CreateOfferSchema),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			title: "",
			text: "",
			target_progress: undefined,
			target_completition_date: undefined,
			comment_locked_state: "Unlocked",
			fee: undefined,
			forum_id: undefined,
			state: "Posted",
		},
	});

	const forumId = watch("forum_id");
	const allowComments = watch("comment_locked_state") === "Unlocked";

	useEffect(() => {
		const defaultDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
		setValue("target_completition_date", defaultDate.toISOString());
	}, [setValue]);

	async function handleOfferCreation(data: TCreateOfferSchema) {
		setIsSubmitting(true);
		setApiError(null);

		const uploadedUrls: string[] = [];
		for (const file of images) {
			const compressedFile = await compressImage(file);
			const url = await uploadImage(compressedFile);
			if (url) uploadedUrls.push(url);
		}

		try {
			const newOffer: Omit<Tables<"Offer">, "id"> = {
				title: data.title,
				text: data.text,
				target_progress: data.target_progress,
				target_completition_date: new Date(data.target_completition_date).toISOString(),
				created_at: new Date().toISOString(),
				creator_id: userUuid,
				current_progress: 0,
				comment_locked_state: data.comment_locked_state ?? "Unlocked",
				fee: data.fee,
				forum_id: data.forum_id,
				likes: 0,
				superlikes: 0,
				state: data.state ?? "Posted",
				images: uploadedUrls || null,
			};

			const response = await PostToDatabase<IOffer>({
				tableName: "Offer",
				contentJson: [newOffer],
			});

			if (response.error) {
				setIsSubmitting(false);
				setApiError(response.error);
				return;
			}

			const inserted = response.data;
			const offerId = inserted?.[0]?.id;

			if (offerId && selectedTags.length > 0) {
				const tagRelations = selectedTags.map((tagId) => ({
					offer_id: offerId,
					tag_id: tagId,
				}));

				const tagResp = await PostToDatabase({
					tableName: "Offer_Tag",
					contentJson: tagRelations,
				});

				if (tagResp.error) {
					setIsSubmitting(false);
					setApiError(tagResp.error);
					return;
				}
			}

			router.push("/offers");
		} catch (error) {
			console.error("Error creating offer:", error);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<APIErrorHandler error={apiError} />

			<form className="flex flex-col gap-6" onSubmit={handleSubmit(handleOfferCreation)}>
				<FormField label="Título" errorMessage={errors.title?.message || ""} htmlFor="title" required>
					<Input id="title" type="text" {...register("title")} disabled={isSubmitting} />
				</FormField>

				<FormField label="Descripción" errorMessage={errors.text?.message || ""} htmlFor="text" required>
					<Textarea className="h-40" id="text" {...register("text")} disabled={isSubmitting} />
				</FormField>

				<div className="flex gap-6 items-start justify-between">
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

					<FormField label="Precio Entrada" errorMessage={errors.fee?.message || ""} htmlFor="fee" required>
						<Input
							id="fee"
							type="number"
							{...register("fee", { valueAsNumber: true })}
							disabled={isSubmitting}
						/>
					</FormField>

					<FormField
						label="Fecha límite del objetivo"
						errorMessage={errors.target_completition_date?.message || ""}
						htmlFor="target_completition_date"
						required
					>
						<DateInput
							id="target_completition_date"
							buttonText="Elige una fecha"
							buttonDisabled={isSubmitting}
							defaultDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
							disabled={{
								before: new Date(Date.now() + 24 * 60 * 60 * 1000),
								after: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
							}}
							startMonth={new Date()}
							endMonth={new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000)}
							onDateChange={(date) => {
								if (date) {
									setValue("target_completition_date", date.toISOString());
								}
							}}
							{...register("target_completition_date")}
						/>
					</FormField>

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

				<FormField label="Tags" htmlFor="tags">
					<SelectTags
						availableTags={tags}
						selectedTags={selectedTags}
						onTagsChange={setSelectedTags}
						placeholder="Selecciona los tags para la petición"
						disabled={isSubmitting}
					/>
				</FormField>

				<FileDropzone value={images} onChange={setImages} maxFiles={5} disabled={isSubmitting} />

				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creando..." : "Crear Oferta"}
				</Button>
			</form>
		</>
	);
}

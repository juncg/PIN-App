"use client";

import SelectTags from "@/components/select/select-tags";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { IForum, IOffer } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PostgrestError } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { CreateOfferSchema, type TCreateOfferSchema } from "./schemas/offer";

interface OfferFormProps {
	forums: IForum[];
	tags: { id: number; name: string }[];
}

export default function OfferForm({ forums, tags }: OfferFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alert, setAlert] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [apiError, setApiError] = useState<PostgrestError | null>(null);
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
			target_progress: 0,
			target_completition_date: "",
			comment_locked_state: "Unlocked",
			fee: 0,
			forum_id: null,
			state: "Posted",
		},
	});

	const forumId = watch("forum_id");
	const allowComments = watch("comment_locked_state") === "Unlocked";

	useEffect(() => {
		if (alert) {
			const timer = setTimeout(() => {
				setAlert(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [alert]);

	const handleOfferCreation = async (data: TCreateOfferSchema) => {
		setIsSubmitting(true);
		setAlert(null);
		setApiError(null);

		if (!userUuid) {
			setAlert({
				type: "error",
				message: "Debes iniciar sesión para crear una oferta.",
			});
			setIsSubmitting(false);
			return;
		}

		try {
			const newOffer = {
				title: data.title,
				text: data.text,
				target_progress: data.target_progress,
				target_completition_date: new Date(data.target_completition_date).toISOString(),
				created_at: new Date().toISOString(),
				creator_id: userUuid,
				current_progress: 0,
				comment_locked_state: data.comment_locked_state ?? "Unlocked",
				fee: data.fee,
				forum_id: data.forum_id ?? null,
				likes: 0,
				superlikes: 0,
				state: data.state ?? "Posted",
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
			setAlert({
				type: "error",
				message: "Error al crear la oferta. Inténtalo de nuevo.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{alert && (
				<Alert
					className={`mb-4 ${
						alert.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
					}`}
				>
					{alert.type === "success" ? (
						<CheckCircle className="h-4 w-4 text-green-600" />
					) : (
						<AlertCircle className="h-4 w-4 text-red-600" />
					)}
					<AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
						{alert.message}
					</AlertDescription>
				</Alert>
			)}

			<APIErrorHandler error={apiError} />

			<form onSubmit={handleSubmit(handleOfferCreation)}>
				<div className="flex flex-col gap-6">
					<div className="grid gap-2">
						<Label htmlFor="title">Titulo</Label>
						<Input id="title" type="text" {...register("title")} disabled={isSubmitting} />
						{errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="text">Descripción</Label>
						<Input id="text" type="text" {...register("text")} disabled={isSubmitting} />
						{errors.text && <p className="text-sm text-red-600">{errors.text.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="target_progress">Objetivo numérico</Label>
						<Input
							id="target_progress"
							type="number"
							{...register("target_progress", { valueAsNumber: true })}
							disabled={isSubmitting}
						/>
						{errors.target_progress && (
							<p className="text-sm text-red-600">{errors.target_progress.message}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="target_completition_date">Fecha limite del objetivo</Label>
						<Input
							id="target_completition_date"
							type="date"
							{...register("target_completition_date")}
							disabled={isSubmitting}
						/>
						{errors.target_completition_date && (
							<p className="text-sm text-red-600">{errors.target_completition_date.message}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="allowComments">Permitir comentarios</Label>
						<Switch
							id="allowComments"
							checked={allowComments}
							onCheckedChange={(checked) =>
								setValue("comment_locked_state", checked ? "Unlocked" : "Locked")
							}
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="fee">Cuota</Label>
						<Input
							id="fee"
							type="number"
							{...register("fee", { valueAsNumber: true })}
							disabled={isSubmitting}
						/>
						{errors.fee && <p className="text-sm text-red-600">{errors.fee.message}</p>}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="forumId">Foro</Label>
						<Select
							value={forumId?.toString() || ""}
							onValueChange={(value) => setValue("forum_id", Number(value))}
							disabled={isSubmitting}
						>
							<SelectTrigger>
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
						{errors.forum_id && <p className="text-sm text-red-600">{errors.forum_id.message}</p>}
					</div>
					<div className="grid gap-2">
						<SelectTags
							availableTags={tags}
							selectedTags={selectedTags}
							onTagsChange={setSelectedTags}
							label="Tags"
							placeholder="Selecciona tags para la petición"
							disabled={isSubmitting}
						/>
					</div>
					<div className="justify-end">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creando..." : "Crear Oferta"}
						</Button>
					</div>
				</div>
			</form>
		</>
	);
}

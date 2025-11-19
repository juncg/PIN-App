"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ExecuteRpcFunction, PostToDatabase, PutToDatabase } from "@/lib/services/general";
import { IReview } from "@/lib/services/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PostgrestError } from "@supabase/supabase-js";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { APIErrorHandler } from "../error-handlers/api-error-handler";
import { FormField } from "./base/form-field";
import { CreateReviewSchema, type TCreateReviewSchema } from "./schemas/review";

interface ProductReviewFormProps {
	onCancel?: () => void;
	onSuccess?: () => void;
	userUuid: string;
	productId: number;
	existingReview?: IReview;
}

export function ProductReviewForm({
	onCancel,
	onSuccess,
	userUuid,
	productId,
	existingReview,
}: ProductReviewFormProps) {
	const isEditMode = !!existingReview;
	const [hoveredRating, setHoveredRating] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alert, setAlert] = useState<IAlert | null>(null);
	const [apiError, setApiError] = useState<PostgrestError | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<TCreateReviewSchema>({
		resolver: zodResolver(CreateReviewSchema),
		mode: "onBlur",
		reValidateMode: "onChange",
		defaultValues: {
			title: existingReview?.title || "",
			content: existingReview?.content || "",
			stars: existingReview?.stars || 0,
		},
	});

	const rating = watch("stars");

	useEffect(() => {
		if (existingReview) {
			reset({
				title: existingReview.title || "",
				content: existingReview.content || "",
				stars: existingReview.stars,
			});
		}
	}, [existingReview, reset]);

	useEffect(() => {
		if (alert) {
			const timer = setTimeout(() => {
				setAlert(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [alert]);

	const handleReviewSubmit = async (data: TCreateReviewSchema) => {
		setIsSubmitting(true);
		setAlert(null);
		setApiError(null);

		try {
			if (isEditMode && existingReview) {
				const { error } = await PutToDatabase({
					tableName: "Review",
					contentJson: {
						title: data.title.trim(),
						content: data.content.trim(),
						stars: data.stars,
						edited_at: new Date().toISOString(),
					},
					filters: [{ method: "eq", column: "id", value: existingReview.id }],
				});

				if (error) {
					setApiError(error);
					return;
				}

				toast.success("Reseña actualizada exitosamente");
			} else {
				const review: Omit<IReview, "id"> = {
					created_at: new Date().toISOString(),
					state: "Posted",
					comment_locked_state: "Unlocked",
					likes: 0,
					superlikes: 0,
					title: data.title.trim(),
					content: data.content.trim(),
					stars: data.stars,
					creator_id: userUuid,
					forum_id: 1,
					edited_at: null,
				};

				const { data: reviewData, error } = await PostToDatabase<IReview>({
					tableName: "Review",
					contentJson: [review],
				});

				if (error || !reviewData || reviewData.length === 0) {
					setApiError(error || null);
					return;
				}

				const reviewId = reviewData[0].id;

				const { error: relationError } = await PostToDatabase({
					tableName: "Review_Product",
					contentJson: [
						{
							review_id: reviewId,
							product_id: productId,
						},
					],
				});

				if (relationError) {
					setApiError(relationError);
					return;
				}

				toast.success("Reseña creada exitosamente");
			}

			const { error: updateError } = await ExecuteRpcFunction({
				functionName: "update_product_rating",
				params: { p_product_id: productId },
			});

			if (updateError) {
				console.error("Error updating product rating:", updateError);
			}

			reset();

			if (onSuccess) {
				onSuccess();
			}
		} catch (error) {
			console.error("Error submitting review:", error);
			setAlert({
				type: "Error",
				message: "Error al procesar la reseña. Inténtalo de nuevo.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		reset();

		if (onCancel) {
			onCancel();
		}
	};

	return (
		<>
			<APIErrorHandler error={apiError} />

			<form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
				<FormField label="Calificación" errorMessage={errors.stars?.message || ""} htmlFor="stars" required>
					<div className="flex gap-1">
						{[1, 2, 3, 4, 5].map((star) => (
							<button
								key={star}
								type="button"
								onClick={() => setValue("stars", star, { shouldValidate: true })}
								onMouseEnter={() => setHoveredRating(star)}
								onMouseLeave={() => setHoveredRating(0)}
								className="transition-transform hover:scale-110"
								disabled={isSubmitting}
							>
								<Star
									className={`w-6 h-6 ${
										star <= (hoveredRating || rating)
											? "fill-yellow-400 text-yellow-400"
											: "text-gray-300"
									}`}
								/>
							</button>
						))}
					</div>
				</FormField>

				<FormField label="Título" errorMessage={errors.title?.message || ""} htmlFor="title" required>
					<Input
						id="title"
						type="text"
						placeholder="Resume tu experiencia"
						{...register("title")}
						disabled={isSubmitting}
					/>
				</FormField>

				<FormField label="Contenido" errorMessage={errors.content?.message || ""} htmlFor="content" required>
					<Textarea
						id="content"
						placeholder="Cuéntanos más sobre tu experiencia"
						{...register("content")}
						className="min-h-[100px] resize-none"
						disabled={isSubmitting}
					/>
				</FormField>

				<div className="flex gap-3 justify-end pt-2">
					<Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
						Cancelar
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting
							? isEditMode
								? "Actualizando..."
								: "Creando..."
							: isEditMode
							? "Actualizar"
							: "Crear"}
					</Button>
				</div>
			</form>
		</>
	);
}

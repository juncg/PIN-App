"use client";

import { useState } from "react";
import { Star, Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IReview } from "@/lib/services/types";
import { PostToDatabase, ExecuteRpcFunction } from "@/lib/services/general";

interface CreateProductReviewFormProps {
	onCancel?: () => void;
	userUuid: string;
	productId: number;
}

export function CreateProductReviewForm({ onCancel, userUuid, productId }: CreateProductReviewFormProps) {
	const [rating, setRating] = useState(0);
	const [hoveredRating, setHoveredRating] = useState(0);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (rating === 0) {
			alert("Por favor selecciona una calificación");
			return;
		}

		if (!title.trim() || !content.trim()) {
			alert("Por favor completa todos los campos");
			return;
		}

		setIsSubmitting(true);

		try {
			const review: Omit<IReview, "id"> = {
				created_at: new Date().toISOString(),
				state: "Posted",
				comment_locked_state: "Unlocked",
				likes: 0,
				superlikes: 0,
				title: title,
				content: content,
				stars: rating,
				creator_id: userUuid,
				forum_id: null,
			};

			const { data, error } = await PostToDatabase<IReview>({
				tableName: "Review",
				contentJson: review,
			});

			if (error || !data || data.length === 0) {
				throw new Error(error?.message || "Error al crear la reseña");
			}

			const reviewId = data[0].id;

			const { error: relationError } = await PostToDatabase({
				tableName: "Review_Product",
				contentJson: {
					review_id: reviewId,
					product_id: productId,
				},
			});

			if (relationError) {
				throw new Error(relationError.message || "Error al vincular la reseña con el producto");
			}

			const { error: updateError } = await ExecuteRpcFunction({
				functionName: "update_product_rating",
				params: { p_product_id: productId },
			});

			if (updateError) {
				throw new Error(updateError.message || "Error al actualizar la calificación del producto");
			}

			setRating(0);
			setTitle("");
			setContent("");

			if (onCancel) {
				onCancel();
			}
		} catch (error) {
			console.error("Error creating review:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancel = () => {
		setRating(0);
		setTitle("");
		setContent("");

		if (onCancel) {
			onCancel();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div>
				<Label className="text-base font-semibold">Calificación</Label>
				<div className="flex gap-1 mt-2">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							onClick={() => setRating(star)}
							onMouseEnter={() => setHoveredRating(star)}
							onMouseLeave={() => setHoveredRating(0)}
							className="transition-transform hover:scale-110"
						>
							<Star
								className={`w-8 h-8 ${
									star <= (hoveredRating || rating)
										? "fill-yellow-400 text-yellow-400"
										: "text-gray-300"
								}`}
							/>
						</button>
					))}
				</div>
			</div>

			<div>
				<Label htmlFor="title" className="text-base font-semibold">
					Título
				</Label>
				<Input
					id="title"
					type="text"
					placeholder="Resume tu experiencia"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="mt-2"
					required
				/>
			</div>

			<div>
				<Label htmlFor="content" className="text-base font-semibold">
					Contenido
				</Label>
				<Textarea
					id="content"
					placeholder="Cuéntanos más sobre tu experiencia con este producto"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="mt-2 min-h-[150px]"
					required
				/>
			</div>

			<div>
				<Label htmlFor="images" className="text-base font-semibold">
					Imágenes
				</Label>
				<div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
					<p className="text-gray-500">No implementado</p>
				</div>
			</div>

			<div className="flex gap-4 justify-end">
				<Button type="button" variant="outline" onClick={handleCancel}>
					Cancelar
				</Button>
				<Button type="submit">Crear Reseña</Button>
			</div>
		</form>
	);
}

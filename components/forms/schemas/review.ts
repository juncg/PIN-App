import * as z from "zod";

const CommentLockedStateSchema = z.enum(["Locked", "Unlocked"]);
const PostStateSchema = z.enum(["Draft", "Posted"]);

export const ReviewSchema = z.object({
	id: z.number(),
	title: z.string(),
	content: z.string().min(1, "El contenido es requerido"),
	stars: z.number().min(1, "La calificación debe ser al menos 1").max(5, "La calificación no puede ser más de 5"),
	creator_id: z.string(),
	forum_id: z.number(),
	likes: z.number(),
	superlikes: z.number(),
	state: PostStateSchema,
	comment_locked_state: CommentLockedStateSchema,
	created_at: z.string(),
	edited_at: z.string().nullable(),
});

export const CreateReviewSchema = z.object({
	content: z
		.string()
		.min(10, "El contenido debe tener al menos 10 caracteres")
		.max(1000, "El contenido no puede exceder 1000 caracteres"),
	stars: z.number().min(1, "Debes seleccionar una calificación").max(5, "La calificación no puede ser más de 5"),
});

export const UpdateReviewSchema = CreateReviewSchema;

export type TReviewSchema = z.infer<typeof ReviewSchema>;
export type TCreateReviewSchema = z.infer<typeof CreateReviewSchema>;
export type TUpdateReviewSchema = z.infer<typeof UpdateReviewSchema>;

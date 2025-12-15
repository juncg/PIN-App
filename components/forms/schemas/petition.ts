import * as z from "zod";

const CommentLockedStateSchema = z.enum(["Locked", "Unlocked"]);
const PostStateSchema = z.enum(["Draft", "Posted"]);

export const CreatePetitionSchema = z.object({
	title: z.string().min(1, "El título es requerido"),
	text: z.string().min(1, "El texto es requerido"),
	target_progress: z.number().min(10, "El progreso objetivo debe ser mayor o igual a 10"),
	comment_locked_state: CommentLockedStateSchema.optional(),
	state: PostStateSchema.optional(),
	forum_id: z.number().min(0, "Debes elegir un foro al que pertenecerá la petición").optional(),
	product_ids: z.array(z.number()).optional(),
	reduced_price: z.number().nullable().optional(),
});

export type TCreatePetitionSchema = z.infer<typeof CreatePetitionSchema>;

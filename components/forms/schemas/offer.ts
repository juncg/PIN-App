import * as z from "zod";

const CommentLockedStateSchema = z.enum(["Locked", "Unlocked"]);
const PostStateSchema = z.enum(["Draft", "Posted"]);

const BusinessSchema = z.object({
	id: z.number(),
	name: z.string().nullable(),
	description: z.string().nullable(),
	owner_id: z.string(),
	verification: z.enum(["Unverified", "Paid", "Official"]).nullable(),
	created_at: z.string(),
});

const TagSchema = z.object({
	id: z.number(),
	name: z.string().nullable(),
	times_used: z.number().nullable(),
	created_at: z.string(),
});

const UserOfferSchema = z.object({
	user_id: z.string(),
	offer_id: z.number(),
	liked: z.boolean(),
	subscribed: z.boolean(),
	email_notification: z.enum(["Frequent", "Infrequent", "None", "OnlyWhenGoalReached"]),
	native_notification: z.enum(["Frequent", "Infrequent", "None", "OnlyWhenGoalReached"]),
});

export const OfferSchema = z.object({
	id: z.number(),
	title: z.string().min(1, "El título es requerido"),
	text: z.string().min(1, "El texto es requerido"),
	fee: z.number().min(1, "La tarifa debe ser mayor o igual a 1"),
	target_progress: z.number().min(0, "El progreso objetivo debe ser mayor o igual a 0"),
	current_progress: z.number().min(0, "El progreso actual debe ser mayor o igual a 0"),
	target_completition_date: z.string(),
	creator_id: z.string(),
	forum_id: z.number().nullable(),
	likes: z.number(),
	superlikes: z.number(),
	state: PostStateSchema,
	comment_locked_state: CommentLockedStateSchema,
	created_at: z.string(),

	type: z.literal("Offer"),
	businesses: z
		.array(
			z.object({
				business: BusinessSchema,
			})
		)
		.optional(),
	tags: z.array(TagSchema).optional(),
	User_Offer: z.array(UserOfferSchema).optional(),
});

export const CreateOfferSchema = z.object({
	title: z.string().min(1, "El título es requerido"),
	text: z.string().min(1, "El texto es requerido"),
	fee: z.number().min(0, "La tarifa debe ser mayor o igual a 0"),
	target_progress: z.number().min(0, "El progreso objetivo debe ser mayor o igual a 0"),
	target_completition_date: z.string().min(1, "La fecha es requerida"),
	comment_locked_state: CommentLockedStateSchema.optional(),
	state: PostStateSchema.optional(),
	forum_id: z.number().nullable().optional(),
});

export type TOfferSchema = z.infer<typeof OfferSchema>;
export type TCreateOfferSchema = z.infer<typeof CreateOfferSchema>;

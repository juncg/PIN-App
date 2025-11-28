import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const forumSchema = z.object({
	name: z
		.string()
		.min(3, "El nombre debe tener al menos 3 caracteres")
		.max(100, "El nombre no puede exceder los 100 caracteres"),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres")
		.max(500, "La descripción no puede exceder los 500 caracteres"),
	profile_picture: z
		.instanceof(File)
		.refine((file) => file.size <= MAX_FILE_SIZE, "La imagen no debe superar los 5MB")
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			"Solo se aceptan imágenes en formato JPG, JPEG, PNG o WebP"
		)
		.optional(),
	banner: z
		.instanceof(File)
		.refine((file) => file.size <= MAX_FILE_SIZE, "La imagen no debe superar los 5MB")
		.refine(
			(file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
			"Solo se aceptan imágenes en formato JPG, JPEG, PNG o WebP"
		)
		.optional(),
});

export type ForumFormData = z.infer<typeof forumSchema>;

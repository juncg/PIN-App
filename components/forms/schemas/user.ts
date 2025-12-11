import * as z from "zod";

export const EditUserSchema = z.object({
	name: z.string().min(1, "El nombre es requerido"),
	surnames: z.string().min(1, "Los apellidos son requeridos"),
	bio: z.string().optional(),
});

export type TEditUserSchema = z.infer<typeof EditUserSchema>;
import * as z from "zod";

export const CreateOfferSchema = z.object({
	name: z.string().min(1, "El nombre empresa es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
});


export type TCreateOfferSchema = z.infer<typeof CreateOfferSchema>;
import * as z from "zod";

export const CreateProductSchema = z.object({
	name: z.string().min(1, "El nombre es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
	msrp: z.number().min(0, "El precio debe ser mayor o igual a 0"),
	business_id: z.number().min(1, "Debes seleccionar un negocio"),
	category_id: z.number().optional(),
	images: z.array(z.instanceof(File)).min(1, "Debes añadir al menos una imagen"),
});

export type TCreateProductSchema = z.infer<typeof CreateProductSchema>;
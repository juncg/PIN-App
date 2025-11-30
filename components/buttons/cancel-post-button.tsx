"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui-custom/alert-dialog";
import { Button } from "@/components/ui-custom/button";
import { PutToDatabase } from "@/lib/services/general";
import { IOffer, IPetition } from "@/lib/services/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type TPost = IOffer | IPetition;

interface CancelPostButtonProps {
	post: TPost;
}

export function CancelPostButton({ post }: CancelPostButtonProps) {
	const [showDialog, setShowDialog] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();

	if (post.state === "Cancelled") {
		return null;
	}

	const handleCancel = async () => {
		setIsSubmitting(true);

		try {
			const { error } = await PutToDatabase({
				tableName: post.type,
				contentJson: { state: "Cancelled" },
				filters: [{ method: "eq", column: "id", value: post.id }],
			});

			if (error) {
				throw new Error(error.message);
			}

			toast.success(
				post.type === "Offer" ? "Oferta cancelada correctamente" : "Petición cancelada correctamente"
			);
			router.refresh();
		} catch (error) {
			console.error("Error canceling post:", error);
			toast.error(post.type === "Offer" ? "Error al cancelar la oferta" : "Error al cancelar la petición");
		} finally {
			setIsSubmitting(false);
			setShowDialog(false);
		}
	};

	return (
		<>
			<Button variant="destructive" size="sm" onClick={() => setShowDialog(true)}>
				Cancelar {post.type === "Offer" ? "Oferta" : "Petición"}
			</Button>

			<AlertDialog open={showDialog} onOpenChange={setShowDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Cancelar {post.type === "Offer" ? "oferta" : "petición"}?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción marcará {post.type === "Offer" ? "la oferta" : "la petición"} como cancelada.
							Los usuarios ya no podrán suscribirse a ella.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Volver</AlertDialogCancel>
						<AlertDialogAction onClick={handleCancel} disabled={isSubmitting}>
							{isSubmitting ? "Cancelando..." : "Confirmar"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

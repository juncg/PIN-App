import { MoreHorizontal, Trash, Pencil, Flag } from "lucide-react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

interface PostActionsDropdownProps {
	isOwner: boolean;
	onEdit?: () => void;
	onDelete?: () => void;
	onReport?: () => void;
}

export function PostActionsDropdown({ isOwner, onEdit, onDelete, onReport }: PostActionsDropdownProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleReport = () => {
		if (onReport) {
			onReport();
		}
		toast.success("Reporte enviado", {
			description: "Gracias por tu reporte. Nuestro equipo lo revisará y tomará las medidas necesarias.",
		});
	};

	const handleDeleteConfirm = () => {
		if (onDelete) {
			onDelete();
		}
		setShowDeleteDialog(false);
		toast.success("Post eliminado", {
			description: "El post ha sido eliminado corrrectamente.",
		});
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon">
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-32">
					{isOwner ? (
						<>
							<DropdownMenuItem onClick={onEdit} className="cursor-pointer">
								<Pencil className="mr-2 h-4 w-4" />
								<span>Editar</span>
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setShowDeleteDialog(true)}
								className="cursor-pointer text-destructive"
							>
								<Trash className="mr-2 h-4 w-4" />
								<span>Eliminar</span>
							</DropdownMenuItem>
						</>
					) : (
						<DropdownMenuItem onClick={handleReport} className="cursor-pointer">
							<Flag className="mr-2 h-4 w-4" />
							<span>Reportar</span>
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
						<AlertDialogDescription>
							Esta acción no se puede deshacer. El post será eliminado permanentemente.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancelar</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteConfirm}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							Eliminar
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

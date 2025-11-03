"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";

interface NotLoggedInDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function NotLoggedInDialog({
    open,
    onOpenChange,
    title = "Accede a tu cuenta",
    description = "Debes iniciar sesión para interactuar con las publicaciones.",
}: NotLoggedInDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <DialogFooter>
					<Link href="/auth/sign-up">
						<Button onClick={() => onOpenChange(false)}>Registrarse</Button>
					</Link>
                    <Link href="/auth/login">
                        <Button onClick={() => onOpenChange(false)}>Iniciar sesión</Button>
                    </Link>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

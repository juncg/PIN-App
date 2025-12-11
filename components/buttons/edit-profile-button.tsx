"use client";

import { Button } from "@/components/ui-custom/button";
import { IUser } from "@/lib/services/types";
import { useState } from "react";
import EditUserForm from "../forms/edit-user-form";

interface EditProfileButtonProps {
	userData: IUser;
}

export default function EditProfileButton({ userData }: EditProfileButtonProps) {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<>
			<Button variant="outlineSquared" size="lg" onClick={() => setDialogOpen(true)}>
				Editar perfil
			</Button>
			<EditUserForm open={dialogOpen} onOpenChange={setDialogOpen} userData={userData} />
		</>
	);
}
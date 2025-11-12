"use client";

import SelectTags from "@/components/select/select-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { IForum, IPetition } from "@/lib/services/types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface CreatePetitionFormProps {
	forums: IForum[];
	tags: { id: number; name: string }[];
}

export default function CreateJoinBusinessForm({ forums, tags }: CreatePetitionFormProps) {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [targetProgress, setTargetProgress] = useState(0);
	const [allowComments, setAllowComments] = useState(true);
	const [forumId, setForumId] = useState<number | null>(null);
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const router = useRouter();
	const { userUuid } = useUser();



	return (

		<div className="flex flex-col gap-6">
			<div className="grid gap-2">
				<Label className="w-full" htmlFor="forumId">Empresa existente (opcional)</Label>
				<Select
					value={forumId?.toString() || ""}
					onValueChange={(value) => setForumId(Number(value))}
					disabled={isSubmitting}
				>
					<SelectTrigger>
						<SelectValue placeholder={"Selecciona una empresa"} />
					</SelectTrigger>
					<SelectContent>
						{forums.map((forum) => (
							<SelectItem key={forum.id} value={forum.id.toString()}>
								{forum.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="title">Nombre de la empresa</Label>
				<Input
					id="title"
					type="text"
					required
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					disabled={isSubmitting}
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="text">Descripción</Label>
				<Input
					id="text"
					type="text"
					required
					value={text}
					onChange={(e) => setText(e.target.value)}
					disabled={isSubmitting}
				/>
			</div>



			<div className="grid gap-2">
				<SelectTags
					availableTags={tags}
					selectedTags={selectedTags}
					onTagsChange={setSelectedTags}
					label="Tags"
					placeholder="No se si esto hace falta lmao lol XD koma joepe jan carlo me cago xd"
					disabled={isSubmitting}
				/>
			</div>

			<div className="justify-end">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? "Creando..." : "Registrarse a empresa"}
				</Button>
			</div>
		</div>

	);
}

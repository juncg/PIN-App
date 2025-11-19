"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

import { SelectTags } from "@/components/select/select-tags";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { IForum, IPetition } from "@/lib/services/types";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImagePreview);

interface CreatePetitionFormProps {
	forums: IForum[];
	tags: { id: number; name: string }[];
}

export default function CreatePetitionForm({ forums, tags }: CreatePetitionFormProps) {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [targetProgress, setTargetProgress] = useState(0);
	const [allowComments, setAllowComments] = useState(true);
	const [forumId, setForumId] = useState<number | null>(null);
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [images, setImages] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const filePondRef = useRef<FilePond>(null);

	const router = useRouter();
	const { userUuid } = useUser();
	const uploadedUrls: string[] = [];
	const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

	const handlePetitionCreation = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// LOGICA DE GUARDAR IMAGENES EN SUPABASE, NO ACABA DE ENTENDER AL 100% COMO FUNCIONA , CUIDADO
		if (images.length > 0) {
			for (const file of images) {
				try {
					const fileName = `${Date.now()}-${file.name}`;
					const { error: uploadError } = await supabase.storage
						.from("Images")
						.upload(fileName, file, { cacheControl: "3600", upsert: false });

					if (uploadError) {
						console.error("Upload error:", uploadError.message);
						continue; // skip this file
					}

					const { data } = supabase.storage.from("Images").getPublicUrl(fileName);
					uploadedUrls.push(data.publicUrl);
				} catch (err: any) {
					console.error("Unexpected error uploading file:", err.message);
				}
			}
		}
		try {
			const newPetition: Omit<IPetition, "id"> = {
				title: title,
				text: text,
				target_progress: targetProgress,
				created_at: new Date().toISOString(),
				creator_id: userUuid || "",
				current_progress: 0,
				comment_locked_state: "Unlocked",
				forum_id: forumId,
				likes: 0,
				superlikes: 0,
				state: "Posted",
				images: uploadedUrls || null,
			};

			const response = await PostToDatabase<Omit<IPetition, "id">>({
				tableName: "Petition",
				contentJson: [newPetition],
			});

			if (response && response[0]?.id && selectedTags.length > 0) {
				const petitionId = response[0].id;
				const tagRelations = selectedTags.map((tagId) => ({
					petition_id: petitionId,
					tag_id: tagId,
				}));

				await PostToDatabase({
					tableName: "Petition_Tag",
					contentJson: tagRelations,
				});
			}

			router.push("/petitions");
		} catch (error) {
			console.error("Error creating petition:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handlePetitionCreation}>
			<div className="flex flex-col gap-6">
				{/* Title */}
				<div className="grid gap-2">
					<Label htmlFor="title">Título</Label>
					<Input
						id="title"
						type="text"
						required
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						disabled={isSubmitting}
					/>
				</div>

				{/* Description */}
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

				{/* Target Progress */}
				<div className="grid gap-2">
					<Label htmlFor="targetProgress">Objetivo numérico</Label>
					<Input
						id="targetProgress"
						type="number"
						required
						value={targetProgress}
						onChange={(e) => setTargetProgress(Number(e.target.value))}
						disabled={isSubmitting}
					/>
				</div>

				{/* Allow Comments */}
				<div className="grid gap-2">
					<Label htmlFor="allowComments">Permitir comentarios</Label>
					<Switch
						id="allowComments"
						checked={allowComments}
						onCheckedChange={setAllowComments}
						disabled={isSubmitting}
					/>
				</div>

				{/* Forum */}
				<div className="grid gap-2">
					<Label htmlFor="forumId">Foro</Label>
					<Select
						value={forumId?.toString() || ""}
						onValueChange={(value) => setForumId(Number(value))}
						disabled={isSubmitting}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecciona un foro" />
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

				{/* Tags */}
				<div className="grid gap-2">
					<SelectTags
						availableTags={tags}
						selectedTags={selectedTags}
						onTagsChange={setSelectedTags}
						label="Tags"
						placeholder="Selecciona tags para la petición"
						disabled={isSubmitting}
					/>
				</div>

				{/* Images */}
				<div className="grid gap-2">
					<Label>Fotos</Label>
					<FilePond
						ref={filePondRef}
						files={images}
						allowMultiple={true}
						maxFiles={5}
						onupdatefiles={(fileItems: any[]) => setImages(fileItems.map((fi) => fi.file as File))}
						name="images"
						labelIdle='Arrastra y suelta tus imágenes o <span class="filepond--label-action">Selecciona</span>'
						disabled={isSubmitting}
						acceptedFileTypes={["image/*"]}
						instantUpload={false}
						imagePreviewHeight={150}
					/>
				</div>

				{/* Submit Button */}
				<div className="justify-end">
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Creando..." : "Crear Petición"}
					</Button>
				</div>
			</div>
		</form>
	);
}

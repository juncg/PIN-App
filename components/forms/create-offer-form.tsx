"use client";

import SelectTags from "@/components/select/select-tags";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/hooks/use-user";
import { PostToDatabase } from "@/lib/services/general";
import { IForum, IOffer } from "@/lib/services/types";
import type { PostgrestError } from "@supabase/supabase-js";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { APIErrorHandler } from "../error-handlers/api-error-handler";

interface OfferFormProps {
	forums: IForum[];
	tags: { id: number; name: string }[];
}

export default function OfferForm({ forums, tags }: OfferFormProps) {
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [targetProgress, setTargetProgress] = useState(0);
	const [targetCompletitionDate, setTargetCompletitionDate] = useState("");
	const [allowComments, setAllowComments] = useState(true);
	const [fee, setFee] = useState(0);
	const [forumId, setForumId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [alert, setAlert] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const [selectedTags, setSelectedTags] = useState<number[]>([]);
	const [apiError, setApiError] = useState<PostgrestError | null>(null);
	const { userUuid } = useUser();

	const router = useRouter();

	useEffect(() => {
		if (alert) {
			const timer = setTimeout(() => {
				setAlert(null);
			}, 5000);

			return () => clearTimeout(timer);
		}
	}, [alert]);

	const handleOfferCreation = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setAlert(null);
		setApiError(null);

		try {
			const newOffer: Omit<IOffer, "id"> = {
				title: title,
				text: text,
				target_progress: targetProgress,
				target_completition_date: new Date(targetCompletitionDate).toISOString(),
				created_at: new Date().toISOString(),
				creator_id: userUuid,
				current_progress: 0,
				comment_locked_state: allowComments ? "Unlocked" : "Locked",
				fee: fee,
				forum_id: forumId,
				likes: 0,
				superlikes: 0,
				state: "Posted",
			} as Omit<IOffer, "id">;

			const response = await PostToDatabase<Omit<IOffer, "id">>({
				tableName: "Offer",
				contentJson: [newOffer],
			});

			if (response.error) {
				setIsSubmitting(false);
				setApiError(response.error);
				return;
			}

			const inserted = response.data;
			const offerId = inserted?.[0]?.id;
			if (offerId && selectedTags.length > 0) {
				const tagRelations = selectedTags.map((tagId) => ({
					offer_id: offerId,
					tag_id: tagId,
				}));

				const tagResp = await PostToDatabase({
					tableName: "Offer_Tag",
					contentJson: tagRelations,
				});

				if (tagResp.error) {
					setIsSubmitting(false);
					setApiError(tagResp.error);
					return;
				}
			}

			router.push("/offers");
		} catch (error) {
			console.error("Error creating offer:", error);
			setAlert({
				type: "error",
				message: "Error al crear la oferta. Inténtalo de nuevo.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{alert && (
				<Alert
					className={`mb-4 ${
						alert.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
					}`}
				>
					{alert.type === "success" ? (
						<CheckCircle className="h-4 w-4 text-green-600" />
					) : (
						<AlertCircle className="h-4 w-4 text-red-600" />
					)}
					<AlertDescription className={alert.type === "success" ? "text-green-800" : "text-red-800"}>
						{alert.message}
					</AlertDescription>
				</Alert>
			)}

			<APIErrorHandler error={apiError} />

			<form onSubmit={handleOfferCreation}>
				<div className="flex flex-col gap-6">
					<div className="grid gap-2">
						<Label htmlFor="title">Titulo</Label>
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
					<div className="grid gap-2">
						<Label htmlFor="targetCompletitionDate">Fecha limite del objetivo</Label>
						<Input
							id="targetCompletitionDate"
							type="date"
							required
							value={targetCompletitionDate}
							onChange={(e) => setTargetCompletitionDate(e.target.value)}
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="allowComments">Permitir comentarios</Label>
						<Switch
							id="allowComments"
							checked={allowComments}
							onCheckedChange={setAllowComments}
							disabled={isSubmitting}
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="fee">Cuota</Label>
						<Input
							id="fee"
							type="number"
							required
							value={fee}
							onChange={(e) => setFee(Number(e.target.value))}
							disabled={isSubmitting}
						/>
					</div>
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
					<div className="justify-end">
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creando..." : "Crear Oferta"}
						</Button>
					</div>
				</div>
			</form>
		</>
	);
}

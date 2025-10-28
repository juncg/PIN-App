"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import SelectTags from "@/components/select/select-tags";
import { PostToDatabase } from "@/lib/services/general";
import { IForum, IPetition } from "@/lib/services/types";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface CreatePetitionFormProps {
  forums: IForum[];
  userId: string | null;
  tags: { id: number; name: string }[];
}

export default function CreatePetitionForm({
  forums,
  userId,
  tags,
}: CreatePetitionFormProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [targetProgress, setTargetProgress] = useState(0);
  const [allowComments, setAllowComments] = useState(true);
  const [forumId, setForumId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handlePetitionCreation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newPetition: Omit<IPetition, "id"> = {
        title: title,
        text: text,
        target_progress: targetProgress,
        created_at: new Date().toISOString(),
        creator_id: userId || "",
        current_progress: 0,
        comment_locked_state: "Unlocked",
        forum_id: forumId,
        likes: 0,
        superlikes: 0,
        state: "Posted",
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
          <Label htmlFor="allowComments">Permitir comentarios</Label>
          <Switch
            id="allowComments"
            checked={allowComments}
            onCheckedChange={setAllowComments}
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
              <SelectValue placeholder={"Selecciona un foro"} />
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
            {isSubmitting ? "Creando..." : "Crear Petición"}
          </Button>
        </div>
      </div>
    </form>
  );
}

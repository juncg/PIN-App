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
import { PostToDatabase } from "@/lib/services/general";
import { IForum, IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PetitionFormProps {
  forums: IForum[];
  userId: string | null;
}

export default function PetitionForm({ forums, userId }: PetitionFormProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [targetProgress, setTargetProgress] = useState(0);
  const [allowComments, setAllowComments] = useState(true);
  const [forumId, setForumId] = useState<number | null>(null);
  const router = useRouter();

  const handlePetitionCreation = async (e: React.FormEvent) => {
    e.preventDefault();
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

    console.log(newPetition);

    const response = PostToDatabase({
      tableName: "Petition",
      contentJson: [newPetition],
    });

    router.push("/petitions");
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
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="allowComments">Permitir comentarios</Label>
          <Switch
            id="allowComments"
            checked={allowComments}
            onCheckedChange={setAllowComments}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="forumId">Foro</Label>
          <Select
            value={forumId?.toString() || ""}
            onValueChange={(value) => setForumId(Number(value))}
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
        <div className="justify-end">
          <Button type="submit">Crear Petición</Button>
        </div>
      </div>
    </form>
  );
}
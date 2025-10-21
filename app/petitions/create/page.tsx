"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IOffer, IPetition } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { createClient } from "@/lib/supabase/client";
import React, { useState } from "react";

export default function Page() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [targetProgress, setTargetProgress] = useState(0);
    const [targetCompletitionDate, setTargetCompletitionDate] = useState("");

    const handleOfferCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        const userUuid = await getUserUuid();
        const newPetition: IPetition = {
            title: title,
            text: text,
            target_progress: targetProgress,
            created_at: new Date().toISOString(),
            creator_id: userUuid || "",
            current_progress: 0,
            comment_locked_state: "Unlocked",
            forum_id: null,
            id: 20,
            likes: null,
            superlikes: null,
            state: "Draft",


        };
        await supabase.from("petitions").insert(newPetition);
    };

    return (
        <div className="flex flex-center flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Crear una oferta</CardTitle>
                    <CardDescription>Introduce todos los datos para crear una nueva oferta</CardDescription>
                </CardHeader>
                <CardContent>
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
                            <div className="justify-end">
                                <Button type="submit">Crear Petición</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

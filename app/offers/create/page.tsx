"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { IOffer } from "@/lib/services/types";
import { createClient } from "@/lib/supabase/client";
import { getUserUuid } from "@/lib/services/user";


export default function Page() {

    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [targetProgress, setTargetProgress] = useState(0);
    const [targetCompletitionDate, setTargetCompletitionDate] = useState('');

    
    const handleOfferCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        const supabase = createClient();
        const userUuid = await getUserUuid();
        const newOffer: IOffer = {
            title: title,
            text: text,
            target_progress: targetProgress,
            target_completition_date: new Date(targetCompletitionDate).toISOString(),
            created_at: new Date().toISOString(),
            creator_id: userUuid,
            current_progress: 0,
            comment_locked_state: "Unlocked",
            fee: null,
            forum_id: null,
            id: 20,
            likes: null,
            superlikes: null,
            state: "Draft"
        }
        await supabase.from('offers').insert(newOffer);
    }

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
                            <div className="grid gap-2">
                                <Label htmlFor="targetCompletitionDate">Fecha limite del objetivo</Label>
                                <Input
                                    id="targetCompletitionDate"
                                    type="date"
                                    required
                                    value={targetCompletitionDate}
                                    onChange={(e) => setTargetCompletitionDate(e.target.value)}
                                />
                            </div>
                            <div className="justify-end">
                                <Button type="submit">Crear Oferta</Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
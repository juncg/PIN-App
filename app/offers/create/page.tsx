"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { IOffer, IForum } from "@/lib/services/types";
import { getUserUuid } from "@/lib/services/user";
import { createClient } from "@/lib/supabase/client";
import React, { useState, useEffect } from "react";
import { PostToDatabase, GetFromDatabase } from "@/lib/services/general";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Page() {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [targetProgress, setTargetProgress] = useState(0);
    const [targetCompletitionDate, setTargetCompletitionDate] = useState("");
    const [allowComments, setAllowComments] = useState(true);
    const [fee, setFee] = useState(0);
    const [forumId, setForumId] = useState<number | null>(null);
    const [forums, setForums] = useState<IForum[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

    // Cargar foros al montar el componente
    useEffect(() => {
        const loadForums = async () => {
            try {
                const forumsData = await GetFromDatabase<IForum>({ tableName: "Forum", select: "*" });
                setForums(forumsData);
            } catch (error) {
                console.error("Error loading forums:", error);
                setAlert({ type: 'error', message: 'Error al cargar los foros' });
            } finally {
                setLoading(false);
            }
        };

        loadForums();
    }, []);

    // Auto-ocultar alerta después de 5 segundos
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
        setSubmitting(true);
        setAlert(null);

        try {
            const userUuid = await getUserUuid();
            const newOffer: Omit<IOffer, 'id'> = {
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
            } as Omit<IOffer, 'id'>;

            console.log(newOffer);
            const response = await PostToDatabase({ tableName: "Offer", contentJson: [newOffer] });

            if (response) {
                setAlert({ type: 'success', message: '¡Oferta creada exitosamente!' });
                setTimeout(() => {
                    router.push("/offers");
                }, 2000);
            } else {
                setAlert({ type: 'error', message: 'Error al crear la oferta. Inténtalo de nuevo.' });
            }
        } catch (error) {
            console.error("Error creating offer:", error);
            setAlert({ type: 'error', message: 'Error al crear la oferta. Inténtalo de nuevo.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-center flex-col gap-8">
            {alert && (
                <Alert className={`max-w-md ${alert.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {alert.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {alert.message}
                    </AlertDescription>
                </Alert>
            )}

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
                                    disabled={submitting}
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
                                    disabled={submitting}
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
                                    disabled={submitting}
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
                                    disabled={submitting}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="allowComments">Permitir comentarios</Label>
                                <Switch
                                    id="allowComments"
                                    checked={allowComments}
                                    onCheckedChange={setAllowComments}
                                    disabled={submitting}
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
                                    disabled={submitting}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="forumId">Foro</Label>
                                <Select
                                    value={forumId?.toString() || ""}
                                    onValueChange={(value) => setForumId(Number(value))}
                                    disabled={loading || submitting}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={loading ? "Cargando foros..." : "Selecciona un foro"} />
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
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Creando..." : "Crear Oferta"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

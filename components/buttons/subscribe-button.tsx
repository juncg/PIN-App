"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { handleSubscribeAction } from "./subscribe-button-actions";

export interface ISubscribeButton {
    post_id: number;
    typeOfPost: "Oferta" | "Petición";
    subscribers: number;
    subscribedByUser: boolean;
    onSubscribeToggle?: () => void;
}

export function SubscribeButton(props: ISubscribeButton) {
    const { post_id, typeOfPost, subscribers, subscribedByUser, onSubscribeToggle } = props;

    const handleSubscribe = async () => {
        onSubscribeToggle?.();

        try {
            await handleSubscribeAction(post_id, subscribedByUser, typeOfPost);

        } catch (error) {
            onSubscribeToggle?.();
            console.error("Error al actualizar suscripción:", error);
        }
    };

    return (
        <Button onClick={handleSubscribe}>
            <span>{subscribedByUser ? "Desuscribirme" : "Suscribirme"}</span>
        </Button>
    );
}
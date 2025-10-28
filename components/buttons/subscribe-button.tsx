"use client";

import { Banana } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { handleLikeAction } from "./like-button-actions";
import { handleSubscribeAction } from "./subscribe-button-actions";

export interface ISubscribeButton {
    subscriptions: number;
    subscribedByUser: boolean;
    post_id: number;
    typeOfPost?: "Oferta" | "Petición";
    onClick?: () => void;
}

export function SubscriptionButton({ props }: { props: ISubscribeButton }) {
    const { subscriptions, subscribedByUser, post_id, typeOfPost, onClick } = props;
    const [numberOfSubscriptions, setSubscriptions] = useState<number>(subscriptions);
    const [subscribed, setSubscribed] = useState<boolean>(subscribedByUser);

    const handleSubscribe = async () => {
        const newSubscribedState = !subscribed;
        const newSubscriptionsCount = newSubscribedState ? numberOfSubscriptions + 1 : numberOfSubscriptions - 1;

        setSubscribed(newSubscribedState);
        setSubscriptions(newSubscriptionsCount);

        try {
            const result = await handleSubscribeAction(post_id, subscribed, typeOfPost);

            console.log("Resultado de la acción:", result);

            if (!result.success) {
                // Revertir cambios si falla
                setSubscribed(subscribed);
                setSubscriptions(numberOfSubscriptions);
                console.error("Error al actualizar suscripción:", result.error);
            }
        } catch (error) {
            // Revertir cambios si falla
            setSubscribed(subscribed);
            setSubscriptions(numberOfSubscriptions);
            console.error("Error al actualizar suscripción:", error);
        }
    };

    return (
        <Button
            onClick={handleSubscribe}
        >
            <Banana className={cn("mr-2", subscribed && "fill-yellow-500 text-yellow-500")} />
            {numberOfSubscriptions || 0}
        </Button>
    );
}

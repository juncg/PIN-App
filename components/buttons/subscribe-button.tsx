"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { handleSubscribeAction } from "./subscribe-button-actions";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";

export interface ISubscribeButton {
    post_id: number;
    typeOfPost: "Oferta" | "Petición";
    subscribedByUser: boolean;
    subscribers: number;
    user_id: string | null;
    onSubscriptionChange?: (newCount: number) => void;
}

export function SubscribeButton(props: ISubscribeButton) {
    const { post_id, typeOfPost, subscribedByUser, subscribers, user_id, onSubscriptionChange } = props;
    const [numberOfSubscribers, setSubscribers] = useState<number>(subscribers);
    const [subscribed, setSubscribed] = useState<boolean>(subscribedByUser);
    const [showDialog, setShowDialog] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    useEffect(() => {
        setSubscribed(subscribedByUser);
    }, [subscribedByUser]);

    useEffect(() => {
        setSubscribers(subscribers);
    }, [subscribers]);

    const performSubscribeToggle = async () => {
        // Optimistic update
        const previousSubscribed = subscribed;
        const previousSubscribers = numberOfSubscribers;
        const newSubscribedState = !subscribed;
        const newSubscribersCount = newSubscribedState ? numberOfSubscribers + 1 : numberOfSubscribers - 1;

        setSubscribed(newSubscribedState);
        setSubscribers(newSubscribersCount);
        onSubscriptionChange?.(newSubscribersCount);

        try {
            const result = await handleSubscribeAction(post_id, typeOfPost);

            if (!result.success) {
                throw new Error(result.error);
            }

            // Update with actual server state
            if (result.subscriptionCount !== undefined) {
                setSubscribers(result.subscriptionCount);
                onSubscriptionChange?.(result.subscriptionCount);
            }
            if (result.userSubscribed !== undefined) {
                setSubscribed(result.userSubscribed);
            }
        } catch (error) {
            // Rollback on error
            setSubscribed(previousSubscribed);
            setSubscribers(previousSubscribers);
            onSubscriptionChange?.(previousSubscribers);
            console.error("Error al actualizar suscripción:", error);
        }
    };

    const handleSubscribe = async () => {
        if (!user_id) {
            setShowLoginDialog(true);
            return;
        }

        // Show warning dialog for Offers when subscribing
        if (typeOfPost === "Oferta" && !subscribed) {
            setShowDialog(true);
            return;
        }

        await performSubscribeToggle();
    };

    const handleConfirmSubscribe = async () => {
        setShowDialog(false);
        await performSubscribeToggle();
    };

    const isDisabled = typeOfPost === "Oferta" && subscribed;

    return (
        <>
            <Button onClick={handleSubscribe} disabled={isDisabled}>
                <span>{subscribed ? "Desuscribirme" : "Suscribirme"}</span>
            </Button>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="size-5" />
                            <DialogTitle>Advertencia</DialogTitle>
                        </div>
                        <DialogDescription>
                            Una vez que te suscribas a esta oferta, no podrás desuscribirte a menos que la oferta sea
                            cancelada o eliminada.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                            Cancelar
                        </Button>
                        <Button variant="default" onClick={handleConfirmSubscribe}>
                            Confirmar suscripción
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <NotLoggedInDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                description="Debes iniciar sesión para suscribirte a esta publicación."
            />
        </>
    );
}

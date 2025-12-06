"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NotLoggedInDialog } from "../dialogs/not-logged-in-dialog";
import { Button } from "../ui-custom/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui-custom/dialog";
import { Switch } from "../ui-custom/switch";
import { handleSubscribeAction } from "./subscribe-button-actions";

export interface ISubscribeButton {
	post_id: number;
	typeOfPost: "Oferta" | "Petición";
	subscribedByUser: boolean;
	subscribers: number;
	user_id: string | null;
	onSubscriptionChange?: (newCount: number) => void;
	fullWidth?: boolean;
	variant?: "default" | "switch";
	onSubscribeChangeForParent?: (subscribed: boolean) => void;
	offerHasFinished?: boolean;
}

export function SubscribeButton(props: ISubscribeButton) {
	const {
		post_id,
		typeOfPost,
		subscribedByUser,
		subscribers,
		user_id,
		onSubscriptionChange,
		fullWidth = false,
		variant = "default",
		offerHasFinished,
	} = props;
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
		const previousSubscribed = subscribed;
		const previousSubscribers = numberOfSubscribers;
		const newSubscribedState = !subscribed;
		const newSubscribersCount = newSubscribedState ? numberOfSubscribers + 1 : numberOfSubscribers - 1;

		setSubscribed(newSubscribedState);
		setSubscribers(newSubscribersCount);
		onSubscriptionChange?.(newSubscribersCount);

		// notify parent of like state change
		if (props.onSubscribeChangeForParent) props.onSubscribeChangeForParent(newSubscribedState);

		try {
			const result = await handleSubscribeAction(post_id, typeOfPost);

			if (!result.success) {
				throw new Error(result.error);
			}

			if (result.subscriptionCount !== undefined) {
				setSubscribers(result.subscriptionCount);
				onSubscriptionChange?.(result.subscriptionCount);
			}
			if (result.userSubscribed !== undefined) {
				setSubscribed(result.userSubscribed);
			}

			if (newSubscribedState) {
				toast.success(`Te has suscrito a esta ${typeOfPost.toLowerCase()} correctamente`);
			} else {
				toast.success(`Te has desuscrito de esta ${typeOfPost.toLowerCase()} correctamente`);
			}
		} catch (error) {
			setSubscribed(previousSubscribed);
			setSubscribers(previousSubscribers);
			onSubscriptionChange?.(previousSubscribers);
			console.error("Error al actualizar suscripción:", error);
			toast.error("Error al actualizar la suscripción");
		}
	};

	const handleSubscribe = async () => {
		if (!user_id) {
			setShowLoginDialog(true);
			return;
		}

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

	const isDisabled = (typeOfPost === "Oferta" && subscribed) || offerHasFinished;

	return (
		<>
			{variant === "switch" ? (
				<Switch
					checked={subscribed}
					onCheckedChange={() => handleSubscribe()}
					disabled={isDisabled}
					innerTextChecked="Suscrito."
					innerTextUnchecked="Suscribirse."
					className={cn(fullWidth && "w-full")}
				/>
			) : (
				<Button onClick={handleSubscribe} disabled={isDisabled} className={cn(fullWidth && "w-full")}>
					<span>{subscribed ? "Desuscribirme." : "Suscribirse."}</span>
				</Button>
			)}

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

"use client";

import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { handleSubscribeAction } from "./subscribe-button-actions";

export interface ISubscribeButton {
	post_id: number;
	typeOfPost: "Oferta" | "Petición";
	subscribedByUser: boolean;
	subscribers: number;
	setSubscribers: (value: number | ((prev: number) => number)) => void;
	setIsSubscribed: (value: boolean | ((prev: boolean) => boolean)) => void;
	disabled: boolean;
}

export function SubscribeButton(props: ISubscribeButton) {
	const { post_id, typeOfPost, subscribers, subscribedByUser, setSubscribers, setIsSubscribed } = props;
	const [showDialog, setShowDialog] = useState(false);

	const toggleSubscribe = () => {
		const newSubscribedState = !subscribedByUser;
		const newSubscribersCount = newSubscribedState ? subscribers + 1 : subscribers - 1;

		setIsSubscribed(newSubscribedState);
		setSubscribers(newSubscribersCount);
	};

	const handleSubscribe = async () => {
		if (props.disabled) return;

		if (typeOfPost === "Oferta" && !subscribedByUser) {
			setShowDialog(true);
			return;
		}

		toggleSubscribe();

		try {
			await handleSubscribeAction(post_id, subscribedByUser, typeOfPost);
		} catch (error) {
			toggleSubscribe();
			console.error("Error al actualizar suscripción:", error);
		}
	};

	const handleConfirmSubscribe = async () => {
		setShowDialog(false);
		toggleSubscribe();

		try {
			await handleSubscribeAction(post_id, subscribedByUser, typeOfPost);
		} catch (error) {
			toggleSubscribe();
			console.error("Error al actualizar suscripción:", error);
		}
	};

	const handleCancelSubscribe = () => {
		setShowDialog(false);
	};

	const isDisabled = typeOfPost === "Oferta" && subscribedByUser;

	return (
		<>
			<Button onClick={handleSubscribe} disabled={isDisabled}>
				<span>{subscribedByUser ? "Desuscribirme" : "Suscribirme"}</span>
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
						<Button variant="outline" onClick={handleCancelSubscribe}>
							Cancelar
						</Button>
						<Button variant="default" onClick={handleConfirmSubscribe}>
							Confirmar suscripción
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

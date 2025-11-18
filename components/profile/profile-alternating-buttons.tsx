"use client";

import { Newspaper, SquareCheckBigIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui-custom/button";

export type TSelection = "Subscriptions" | "Posts";

interface ProfileAltenatingButtonsProps {
	subscriptionsContent: React.ReactNode;
	postsContent: React.ReactNode;
}

export function ProfileAltenatingButtons({ subscriptionsContent, postsContent }: ProfileAltenatingButtonsProps) {
	const [selected, setSelected] = useState<TSelection>("Subscriptions");

	return (
		<>
			<div className="flex w-full gap-4">
				<Button
					variant={selected === "Subscriptions" ? "secondary" : "default"}
					className="w-full"
					onClick={() => setSelected("Subscriptions")}
				>
					Mis suscripciones <SquareCheckBigIcon />
				</Button>
				<Button
					variant={selected === "Posts" ? "secondary" : "default"}
					className="w-full"
					onClick={() => setSelected("Posts")}
				>
					Mis publicaciones <Newspaper />
				</Button>
			</div>

			{selected === "Subscriptions" && subscriptionsContent}
			{selected === "Posts" && postsContent}
		</>
	);
}

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
			<div className="flex w-full border-b-[2px]">
				<Button
					variant="ghost"
					className="w-full justify-start p-4 h-full"
					onClick={() => setSelected("Subscriptions")}
				>
					Mis suscripciones <SquareCheckBigIcon />
				</Button>
				<Button variant="ghost" className="w-full" onClick={() => setSelected("Posts")}>
					Mis publicaciones <Newspaper />
				</Button>
			</div>

			{selected === "Subscriptions" && subscriptionsContent}
			{selected === "Posts" && postsContent}
		</>
	);
}

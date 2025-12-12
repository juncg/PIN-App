"use client";

import { Shining2LineIcon } from "../icons/icons";
import { Button } from "../ui-custom/button";

export interface IHyoerLikeButton {}

export function HyperLikeButton() {
    return (
		<Button className="h-8 w-8 rounded-full p-0 hover:scale-100 transition-none" size="icon">
			<Shining2LineIcon className="text-black !w-5 !h-5" />
		</Button>
    );
}

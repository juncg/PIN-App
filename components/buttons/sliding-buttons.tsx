"use client";

import { ReactNode, useState } from "react";
import { Button } from "../ui-custom/button";
import { cn } from "@/lib/utils";

export interface SlidingButtonProps {
	content: ReactNode;
	displayName: string;
	displayIcon?: ReactNode;
}

interface SlidingButtonsProps {
	buttonsContent: SlidingButtonProps[];
	textSize?: string; // Nueva prop opcional
}

export function AltenatingButtons({ buttonsContent, textSize = "text-base" }: SlidingButtonsProps) {
	const [selected, setSelected] = useState<number>(0);
	const totalButtons = buttonsContent.length;
	const buttonWidth = 100 / totalButtons;

	return (
		<div className="flex flex-col gap-8 w-full">
			<div className="relative flex">
				<div
					className="absolute bottom-0 h-[3px] bg-white transition-transform duration-300 ease-in-out"
					style={{
						width: `${buttonWidth}%`,
						transform: `translateX(${selected * 100}%)`,
					}}
				/>

				{buttonsContent.map((buttonContent: SlidingButtonProps, index: number) => (
					<Button
						key={index}
						variant="ghost"
						className={cn(
							"w-full justify-start p-4 h-full hover:bg-transparent hover:text-white border-b-[3px] border-b-cardborder rounded-none",
							textSize, // Aplica el tamaño de texto
							selected !== index ? "text-cardborder" : ""
						)}
						onClick={() => setSelected(index)}
					>
						{buttonContent.displayName}
						{buttonContent.displayIcon}
					</Button>
				))}
			</div>

			{buttonsContent[selected].content}
		</div>
	);
}

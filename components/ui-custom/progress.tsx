"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function Progress({ className, value, ...props }: ComponentProps<typeof ProgressPrimitive.Root>) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn("bg-black/20 relative h-2 w-full overflow-hidden rounded-full", className)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="bg-black h-full w-full flex-1 transition-all rounded-[20px]"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

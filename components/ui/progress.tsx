"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";

import { cn } from "@/lib/utils";

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
	const percentage = value || 0;

	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn("bg-black/20 relative h-2 w-full overflow-hidden rounded-full", className)}
			{...props}
		>
			<div className="flex h-full">
				<div
					className="bg-black h-full transition-all"
					style={{ width: percentage > 100 ? `${(100 / percentage) * 100}%` : `${percentage}%` }}
				></div>
				{percentage > 100 && (
					<div
						className="bg-chernobyl h-full transition-all"
						style={{ width: `${((percentage - 100) / percentage) * 100}%` }}
					></div>
				)}
			</div>
		</ProgressPrimitive.Root>
	);
}

export { Progress };

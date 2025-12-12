"use client";

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as React from "react";

import { cn } from "@/lib/utils";

import Lenis from "lenis";

function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
	const viewportRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if (!viewportRef.current) return;
		const lenis = new Lenis({
			wrapper: viewportRef.current,
			content: viewportRef.current.firstElementChild as HTMLElement | undefined,
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		return () => {
			lenis.destroy();
		};
	}, []);

	return (
		<ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative", className)} {...props}>
			<ScrollAreaPrimitive.Viewport
				ref={viewportRef}
				data-slot="scroll-area-viewport"
				className="focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
			>
				{children}
			</ScrollAreaPrimitive.Viewport>
			<ScrollBar />
			<ScrollAreaPrimitive.Corner />
		</ScrollAreaPrimitive.Root>
	);
}

function ScrollBar({
	className,
	orientation = "vertical",
	...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
	return (
		<ScrollAreaPrimitive.ScrollAreaScrollbar
			data-slot="scroll-area-scrollbar"
			orientation={orientation}
			className={cn(
				"flex touch-none p-px transition-colors select-none group",
				orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
				orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
				className
			)}
			{...props}
		>
			<ScrollAreaPrimitive.ScrollAreaThumb
				data-slot="scroll-area-thumb"
				className="bg-border relative flex-1 rounded-full bg-cardborder group-hover:bg-lightgrey transition-colors"
			/>
		</ScrollAreaPrimitive.ScrollAreaScrollbar>
	);
}

export { ScrollArea, ScrollBar };

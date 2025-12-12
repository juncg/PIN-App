"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { DealBuyAnd, DealBuyDot } from "../icons/icons";

interface SpecialSeparatorProps {
	iconSize?: string;
	gap?: string;
	className?: string;
}

export function SpecialSeparator({ iconSize = "w-8 h-8", gap = "gap-2", className }: SpecialSeparatorProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [elementCount, setElementCount] = useState(1);

	useEffect(() => {
		const updateCount = () => {
			if (!containerRef.current) return;

			const containerHeight = containerRef.current.clientHeight;
			const iconSizeMatch = iconSize.match(/h-(\d+)/);
			const iconPixels = iconSizeMatch ? parseInt(iconSizeMatch[1]) * 4 : 32;

			const gapMatch = gap.match(/gap-(\d+)/);
			const gapPixels = gapMatch ? parseInt(gapMatch[1]) * 4 : 8;

			const containerGapPixels = 4;
			const elementHeight = iconPixels * 2 + gapPixels;
			const totalElementHeight = elementHeight + containerGapPixels;

			const count = Math.max(1, Math.floor((containerHeight + containerGapPixels) / totalElementHeight));

			setElementCount(count);
		};

		updateCount();
		window.addEventListener("resize", updateCount);

		const resizeObserver = new ResizeObserver(updateCount);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			window.removeEventListener("resize", updateCount);
			resizeObserver.disconnect();
		};
	}, [iconSize, gap]);

	const logoSequence = Array.from({ length: elementCount }, (_, i) => (
		<div key={`sequence-${i}`} className={cn("flex flex-col items-center", gap)}>
			{i === 0 && <DealBuyDot className={iconSize} />}
			<DealBuyAnd className={iconSize} />
			<DealBuyDot className={iconSize} />
		</div>
	));

	return (
		<div
			ref={containerRef}
			className={cn(
				"flex flex-col justify-center items-center gap-1 h-full max-h-full overflow-hidden",
				className
			)}
		>
			{logoSequence}
		</div>
	);
}

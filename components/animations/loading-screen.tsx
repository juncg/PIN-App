"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface LoadingAnimationProps {
	className?: string;
}

export function LoadingAnimation({ className }: LoadingAnimationProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const logoPathRef = useRef<SVGPathElement>(null);
	const dotRef = useRef<SVGCircleElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			const tl = gsap.timeline({
				defaults: { ease: "power3.out" },
			});

			gsap.set(logoPathRef.current, { autoAlpha: 0, y: 20 });
			gsap.set(dotRef.current, { scale: 0, transformOrigin: "center center" });

			tl.to(logoPathRef.current, {
				duration: 1,
				autoAlpha: 1,
				y: 0,
			})
				.to(
					dotRef.current,
					{
						duration: 0.3,
						scale: 1,
						ease: "back.out(1.7)",
					},
					"-=0.7"
				)
				.to(dotRef.current, {
					duration: 0.8,
					scale: 1.2,
					repeat: -1,
					yoyo: true,
					ease: "sine.inOut",
				});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className={cn("fixed inset-0 flex items-center justify-center bg-background", className)}
		>
			<svg
				width="166"
				height="166"
				viewBox="0 0 166 166"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-32 w-32 md:h-40 md:w-40"
			>
				<path
					ref={logoPathRef}
					d="M61.2333 127C55.1667 127 49.8944 125.953 45.4167 123.858C41.0111 121.764 37.5444 118.839 35.0167 115.083C32.5611 111.256 31.3333 106.814 31.3333 101.758C31.3333 97.7139 32.2 94.2472 33.9333 91.3583C35.6667 88.3972 37.9056 85.9778 40.65 84.1C43.3944 82.15 46.3194 80.8139 49.425 80.0917V79.6583C46.825 78.7917 44.4778 77.5278 42.3833 75.8667C40.2889 74.2056 38.6278 72.1833 37.4 69.8C36.1722 67.4167 35.5583 64.8167 35.5583 62C35.5583 55.0667 38.05 49.5417 43.0333 45.425C48.0167 41.3083 54.7333 39.25 63.1833 39.25H81.4917V55.2833H65.35C61.6667 55.2833 58.85 56.1139 56.9 57.775C54.95 59.3639 53.975 61.7111 53.975 64.8167C53.975 67.85 54.95 70.1972 56.9 71.8583C58.9222 73.5194 61.7389 74.35 65.35 74.35H85.9333V62H102.508V74.4583H114.533V88.7583H102.508V127H61.2333ZM64.05 110.967H85.5V88.7583H63.9417C59.5361 88.7583 56.0694 89.6972 53.5417 91.575C51.0139 93.4528 49.75 96.1972 49.75 99.8083C49.75 103.419 50.9778 106.2 53.4333 108.15C55.9611 110.028 59.5 110.967 64.05 110.967Z"
					fill="currentColor"
					className="text-foreground dark:text-white text-black"
				/>

				<circle ref={dotRef} cx="128" cy="115" r="12" fill="#C4FF33" />
			</svg>
		</div>
	);
}

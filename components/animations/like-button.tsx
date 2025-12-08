"use client";

import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { FavoriteBorderIcon, FavoriteIcon } from "../icons/icons";

interface AnimatedLikeButtonProps {
	liked: boolean;
	onClick: () => void;
	className?: string;
}

export function AnimatedLikeButton({ liked, onClick, className }: AnimatedLikeButtonProps) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const iconRef = useRef<HTMLDivElement>(null);
	const particlesRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (liked && buttonRef.current && iconRef.current && particlesRef.current) {
			const tl = gsap.timeline();

			// Animación del icono principal
			tl.to(iconRef.current, {
				scale: 1.3,
				duration: 0.2,
				ease: "back.out(4)",
			})
				.to(iconRef.current, {
					scale: 1,
					duration: 0.3,
					ease: "elastic.out(1, 0.3)",
				})
				.to(
					buttonRef.current,
					{
						rotate: -10,
						duration: 0.1,
						yoyo: true,
						repeat: 3,
						ease: "power2.inOut",
					},
					0
				);

			// Animación de partículas
			const particles = particlesRef.current.children;
			Array.from(particles).forEach((particle, index) => {
				const angle = (360 / particles.length) * index;
				const rad = (angle * Math.PI) / 180;
				const distance = 40;

				gsap.fromTo(
					particle,
					{
						x: 0,
						y: 0,
						scale: 0,
						opacity: 1,
					},
					{
						x: Math.cos(rad) * distance,
						y: Math.sin(rad) * distance,
						scale: 1,
						opacity: 0,
						duration: 0.6,
						ease: "power2.out",
						delay: 0.1,
					}
				);
			});
		}
	}, [liked]);

	const handleClick = () => {
		onClick();
	};

	return (
		<button
			ref={buttonRef}
			onClick={handleClick}
			className={cn("relative h-8 w-8 rounded-full p-0 transition-colors", className)}
		>
			{/* Partículas */}
			<div ref={particlesRef} className="absolute inset-0 pointer-events-none">
				{[...Array(8)].map((_, i) => (
					<div
						key={i}
						className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-destructive opacity-0"
					/>
				))}
			</div>

			{/* Icono */}
			<div ref={iconRef} className="flex items-center justify-center">
				{liked ? (
					<FavoriteIcon className={cn("!h-5 !w-5 text-destructive")} />
				) : (
					<FavoriteBorderIcon className={cn("!h-5 !w-5")} />
				)}
			</div>
		</button>
	);
}

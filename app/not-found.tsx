"use client";

import { Button } from "@/components/ui/button";
import { H1, P } from "@/components/ui/typography";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
	const [showSpecialImage, setShowSpecialImage] = useState(false);

	useEffect(() => {
		const randomNumber = Math.floor(Math.random() * 100) + 1;
		setShowSpecialImage(randomNumber === 1);
	}, []);

	return (
		<div className="flex flex-col items-center justify-center gap-8">
			{showSpecialImage && (
				<div className="relative w-64 h-64 hover:animate-spin transition-transform duration-300 hover:rotate-360">
					<Image
						src="/images/jancarlo.jpg"
						alt="Página no encontrada"
						fill
						className="object-contain"
						priority
					/>
				</div>
			)}

			<div className="flex flex-col text-center">
				<H1>404 | Not Found</H1>
				<P>Could not find requested resource</P>
				{showSpecialImage && (
					<P className="text-sm text-muted-foreground mt-2">
						¡Felicidades! Encontraste la imagen secreta (1/100) 🎉
					</P>
				)}
			</div>

			<Button>
				<Link href="/">Return Home</Link>
			</Button>
		</div>
	);
}

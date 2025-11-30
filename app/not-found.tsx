"use client";

import { Button } from "@/components/ui-custom/button";
import { H1 } from "@/components/ui-custom/typography";
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
						src="/placeholder.png"
						alt="Página no encontrada"
						fill
						className="object-contain"
						priority
						unoptimized
					/>
				</div>
			)}

			<div className="flex flex-col text-center">
				<H1>404 | Ups, ha habido un error</H1>

				<B1>No hemos podido encontrar el recurso que estás buscando</B1>

				{showSpecialImage && (
					<B1 className="text-sm text-lightgrey mt-2">¡Felicidades! Encontraste la imagen secreta 🎉</B1>
				)}
			</div>

			<Button>
				<Link href="/">Volver a inicio</Link>
			</Button>
		</div>
	);
}

"use client";   

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default async function Offers() {
    const router = useRouter();

    return (
		<section className="flex flex-row justify-center gap-8">
			<div className="flex flex-center flex-col gap-8">
                <h1>Ofertas</h1>
                <h2>Esto no esta implementado</h2>
                <Button onClick={() => router.push("/offers/create")}>Crear una Oferta</Button>
            </div>
        </section>
    );
}
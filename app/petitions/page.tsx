"use client";

import { Button } from "@/components/ui/button";
import { H1, H2 } from "@/components/ui/typography";
import { useRouter } from "next/navigation";


export default function Petitions() {
    const router = useRouter();

    return (
        <section className="flex flex-row justify-center gap-8">
            <div className="flex flex-center flex-col gap-8">
                <H1>Peticiones</H1>
                <H2>Esto no esta implementado</H2>
                <Button onClick={() => router.push("/petitions/create")}>Crear una Petición</Button>
            </div>
        </section>
    );
}
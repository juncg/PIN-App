import { Button } from "@/components/ui/button";
import Link from "next/link";


export default async function Offers() {
    return (
        <section className="flex flex-row justify-center gap-8">
            <div className="flex flex-center flex-col gap-8">
                <h1>Ofertas</h1>
                <h2>Esto no esta implementado</h2>
                <Link href="/offers/create">
                    <Button>Crear una oferta</Button>
                </Link>


            </div>
        </section>
    );
}
import { Button } from "@/components/ui/button";
import { Edit, Plus, Search } from "lucide-react";
import { H1, H2 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import Link from "next/link";
import { OfferServices } from "./page-services";

export default async function Offers() {
  const { offers } = await OfferServices();

  return (
    <section className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="justify-start">
          <h1>Ofertas</h1>
          <p className="text-muted-foreground">
            Aqui puedes ver las ofertas existentes
          </p>
        </div>
        <Link href="/offers/create">
          <Plus className="w-5 h-5" />
          Nueva Oferta
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ofertas..."
          value={""}
          className="pl-10 glass"
        />
      </div>

      <div className="">

      </div>
    </section>
  );
}

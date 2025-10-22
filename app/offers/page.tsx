import { Button } from "@/components/ui/button";
import { Edit, Plus, Search } from "lucide-react";
import { H1, H2 } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";
import { GetFromDatabase } from "@/lib/services/general";
import { IOffer } from "@/lib/services/types";
import Link from "next/link";
import { OfferServices } from "./page-services";
import SearchOffers from "@/components/search/search";
import SearchItems from "@/components/search/search";

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
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nueva Oferta
          </Button>
        </Link>
      </div>

      <SearchItems items={offers} postType="Oferta" />
    </section>
  );
}

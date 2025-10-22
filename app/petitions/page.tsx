import { Button } from "@/components/ui/button";
import { H1, H2 } from "@/components/ui/typography";
import { GetFromDatabase } from "@/lib/services/general";
import { IPetition } from "@/lib/services/types";
import { PostCard } from "@/components/cards/postCard";
import { PetitionServices } from "./page-services";
import Link from "next/link";
import { Plus } from "lucide-react";
import SearchItems from "@/components/search/search";

export default async function Petitions() {
  const { petitions } = await PetitionServices();

  return (
    <section className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="justify-start">
          <h1>Peticiones</h1>
          <p className="text-muted-foreground">
            Aqui puedes ver las peticiones existentes
          </p>
        </div>
        <Link href="/petitions/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nueva Peticion
          </Button>
        </Link>
      </div>

      <SearchItems items={petitions} postType="Petición" />
    </section>
  );
}

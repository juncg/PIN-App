"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { IOffer } from "@/lib/services/types";
import { PostCard } from "../cards/postCard";

interface SearchOffersProps {
  offers: IOffer[];
}

export default function SearchOffers({ offers }: SearchOffersProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOffers = offers.filter(
    (offer) =>
      offer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar ofertas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 glass"
        />
      </div>

      <div className="grid gap-4">
        {filteredOffers.length === 0 ? (
          <p className="text-muted-foreground">No se encontraron ofertas</p>
        ) : (
          filteredOffers.map((offer: IOffer) => (
            <PostCard
              key={offer.id}
              props={{
                className: "w-full",
                businessName: "N/A",
                productDescription: offer.text || "N/A",
                productName: offer.title || "N/A",
                typeOfPost: "Oferta",
                peopleSignedCurrent: offer.current_progress || 0,
                peopleSignedObjective: offer.target_progress || 0,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
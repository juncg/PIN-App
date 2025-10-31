"use client";

import { Input } from "@/components/ui/input";
import { IOffer, IPetition } from "@/lib/services/types";
import { Search } from "lucide-react";
import { useState } from "react";
import { PostCard } from "../cards/postCard";

type SearchableItem = IOffer | IPetition;
type PostType = "Oferta" | "Petición";

interface SearchItemsProps {
	items: SearchableItem[];
	postType: PostType;
	userUuid: string;
}

export default function SearchItems({ items, postType, userUuid }: SearchItemsProps) {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredItems = items.filter(
		(item) => item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false
	);

	return (
		<div className="space-y-6">
			<div className="relative max-w-md">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
				<Input
					placeholder={`Buscar ${postType === "Oferta" ? "ofertas" : "peticiones"}...`}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="pl-10 glass"
				/>
			</div>

			<div className="grid gap-4">
				{filteredItems.length === 0 ? (
					<p className="text-muted-foreground">No se encontraron ofertas</p>
				) : (
					filteredItems.map((item: SearchableItem) => (
						<PostCard
							key={item.id}
							props={{
								className: "w-full",
								typeOfPost: postType,
								likedByUser: item.liked || false,
								post: item,
								userUuid: userUuid,
								tags: item.tags || [],
								subscribedByUser: item.subscribed || false,
							}}
						/>
					))
				)}
			</div>
		</div>
	);
}

"use client";

import { PostCardHorizontal } from "@/components/cards/post-card-horizontal";
import { ProfilePostFilter } from "@/components/filters/profile-post-filter";
import { Button } from "@/components/ui-custom/button";
import { B1, H2 } from "@/components/ui-custom/typography";
import { IOffer, IPetition } from "@/lib/services/types";
import { useState } from "react";

type TPost = IOffer | IPetition;

interface ProfileSubscriptionsListProps {
	subscribedOffers: IOffer[];
	subscribedPetitions: IPetition[];
	subscribedOffersCount: number;
	subscribedPetitionsCount: number;
}

export function ProfileSubscriptionsList({
	subscribedOffers,
	subscribedPetitions,
	subscribedOffersCount,
	subscribedPetitionsCount,
}: ProfileSubscriptionsListProps) {
	const allSubscriptions = [...subscribedOffers, ...subscribedPetitions].sort((a, b) => {
		const dateA = new Date(a.created_at).getTime();
		const dateB = new Date(b.created_at).getTime();
		return dateB - dateA;
	});

	const [filteredPosts, setFilteredPosts] = useState<TPost[]>(allSubscriptions);
	const [currentFilter, setCurrentFilter] = useState<"all" | "offer" | "petition">("all");

	const handleFilterChange = (
		status: "all" | "offer" | "petition" | "on-fire" | "active" | "completed" | "expired"
	) => {
		let posts: TPost[] = [];

		if (status === "all") {
			posts = allSubscriptions;
			setCurrentFilter("all");
		} else if (status === "offer") {
			posts = subscribedOffers;
			setCurrentFilter("offer");
		} else if (status === "petition") {
			posts = subscribedPetitions;
			setCurrentFilter("petition");
		} else {
			if (currentFilter === "all") {
				posts = allSubscriptions;
			} else if (currentFilter === "offer") {
				posts = subscribedOffers;
			} else {
				posts = subscribedPetitions;
			}
		}

		setFilteredPosts(posts);
	};

	const getResultCount = () => {
		if (currentFilter === "all") return subscribedOffersCount + subscribedPetitionsCount;
		if (currentFilter === "offer") return subscribedOffersCount;
		return subscribedPetitionsCount;
	};

	return (
		<div className="flex flex-col gap-12 w-full">
			<div className="flex items-center justify-between">
				<span className="flex items-end gap-6">
					<H2>
						{currentFilter === "all"
							? "Todas las suscripciones"
							: currentFilter === "offer"
							? "Ofertas"
							: "Peticiones"}
						.
					</H2>
					<B1 className="text-lightgrey line-clamp-2">
						{getResultCount()}{" "}
						{currentFilter === "all"
							? "suscripciones"
							: currentFilter === "offer"
							? "ofertas"
							: "peticiones"}{" "}
						en total
					</B1>
				</span>
			</div>

			<div className="w-full overflow-x-auto">
				<ProfilePostFilter onFilterChange={handleFilterChange} />
			</div>

			<div className="flex flex-col gap-12 w-full">
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-8 w-full">
						{filteredPosts.length === 0 ? (
							<p className="text-center text-lightgrey-foreground py-12">
								No se encontraron suscripciones
							</p>
						) : (
							filteredPosts.map((post) => (
								<PostCardHorizontal key={`${post.type}-${post.id}`} post={post} />
							))
						)}
					</div>

					{filteredPosts.length > 0 && (
						<div className="mx-auto">
							<Button>Mostrar más</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

"use client";

import { PostCardHorizontal } from "@/components/cards/post-card-horizontal";
import { ProfilePostFilter } from "@/components/filters/profile-post-filter";
import { B1 } from "@/components/ui-custom/typography";
import { IOffer, IPetition } from "@/lib/services/types";
import { useState } from "react";

type TPost = IOffer | IPetition;

interface ProfilePostsListProps {
	offers: IOffer[];
	petitions: IPetition[];
	allPosts: TPost[];
	offersCount: number;
	petitionsCount: number;
	totalCount: number;
}

export function ProfilePostsList({
	offers,
	petitions,
	allPosts,
	offersCount,
	petitionsCount,
	totalCount,
}: ProfilePostsListProps) {
	const [filteredPosts, setFilteredPosts] = useState<TPost[]>(allPosts);
	const [currentType, setCurrentType] = useState<"all" | "offer" | "petition">("all");

	const handleFilterChange = (
		status: "all" | "offer" | "petition" | "on-fire" | "active" | "completed" | "expired"
	) => {
		let posts: TPost[] = [];

		// Filter by type
		if (status === "all") {
			posts = allPosts;
		} else if (status === "offer") {
			posts = offers;
		} else if (status === "petition") {
			posts = petitions;
		}

		setFilteredPosts(posts);
	};

	const getResultCount = () => {
		if (currentType === "all") return totalCount;
		if (currentType === "offer") return offersCount;
		return petitionsCount;
	};

	return (
		<div className="flex flex-col gap-6 w-full overflow-hidden">
			<div className="w-full overflow-x-auto">
				<ProfilePostFilter onFilterChange={handleFilterChange} />
			</div>

			<div className="flex items-center justify-between">
				<B1 className="text-lightgrey-foreground">
					{getResultCount()} {getResultCount() === 1 ? "resultado" : "resultados"}
				</B1>
			</div>

			<div className="space-y-6">
				{filteredPosts.length === 0 ? (
					<p className="text-center text-lightgrey-foreground py-12">No se encontraron publicaciones</p>
				) : (
					filteredPosts.map((post) => <PostCardHorizontal key={`${post.type}-${post.id}`} post={post} />)
				)}
			</div>
		</div>
	);
}

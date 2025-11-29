"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { IForum } from "@/lib/services/types";
import { useCallback, useEffect, useState } from "react";
import { ForumCard } from "../cards/forum-card";
import { P } from "../ui-custom/typography";
import { Skeleton } from "../ui/skeleton";

interface InfiniteForumListProps {
	initialForums: IForum[];
	loadMoreAction: (page: number, pageSize: number, forumName?: string) => Promise<IForum[]>;
	searchParams?: {
		locale?: string;
		postName?: string;
	};
	pageSize?: number;
	maxForums?: number;
}

export function InfiniteForumList({
	initialForums,
	loadMoreAction,
	searchParams,
	pageSize = 5,
	maxForums = 50,
}: InfiniteForumListProps) {
	const [forums, setForums] = useState<IForum[]>(initialForums);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialForums.length >= pageSize);
	const [page, setPage] = useState(1);

	useEffect(() => {
		setForums(initialForums);
		setPage(1);
		setHasMore(initialForums.length >= pageSize);
	}, [searchParams?.postName, initialForums, pageSize]);

	const loadMore = useCallback(async () => {
		if (isLoading || !hasMore) return;

		if (forums.length >= maxForums) {
			setHasMore(false);
			return;
		}

		setIsLoading(true);

		try {
			const newForums = await loadMoreAction(page, pageSize, searchParams?.postName || "");

			if (newForums.length === 0 || forums.length + newForums.length >= maxForums) {
				setHasMore(false);
			}

			const remainingSlots = maxForums - forums.length;
			const forumsToAdd = newForums.slice(0, remainingSlots);

			setForums((prev) => [...prev, ...forumsToAdd]);
			setPage((prev) => prev + 1);

			if (forumsToAdd.length < newForums.length) {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading more forums:", error);
		} finally {
			setIsLoading(false);
		}
	}, [isLoading, hasMore, page, pageSize, loadMoreAction, searchParams?.postName, forums, maxForums]);

	const { loadMoreRef } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore,
		isLoading,
		threshold: 300,
	});

	if (forums.length === 0 && !isLoading) {
		return <P className="text-muted">No se encontraron foros</P>;
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-4">
				{forums.map((forum) => (
					<ForumCard key={forum.id} className="w-full" forum={forum} />
				))}
			</div>

			{/* Observer element to detect end of page */}
			<div ref={loadMoreRef} className="py-4">
				{isLoading && (
					<div className="space-y-4">
						<Skeleton className="h-32 w-full" />
						<Skeleton className="h-32 w-full" />
					</div>
				)}
			</div>

			{/* Message when limit has been reached */}
			{!hasMore && forums.length > 0 && (
				<P className="text-center text-muted py-4">No hay más foros para mostrar</P>
			)}
		</div>
	);
}

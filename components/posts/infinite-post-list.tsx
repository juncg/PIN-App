"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { TPost } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { PostCard } from "../cards/post-card";
import { Skeleton } from "../ui/skeleton";
import { P } from "../ui/typography";

interface InfinitePostListProps {
	initialPosts: TPost[];
	loadMoreAction: (page: number, pageSize: number, postName?: string) => Promise<TPost[]>;
	searchParams?: {
		locale?: string;
		postName?: string;
	};
	pageSize?: number;
	maxPosts?: number;
}

export function InfinitePostList({
	initialPosts,
	loadMoreAction,
	searchParams,
	pageSize = 5,
	maxPosts = 50,
}: InfinitePostListProps) {
	const [posts, setPosts] = useState<TPost[]>(initialPosts);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts.length >= pageSize);
	const [page, setPage] = useState(1);

	useEffect(() => {
		setPosts(initialPosts);
		setPage(1);
		setHasMore(initialPosts.length >= pageSize);
	}, [searchParams?.postName, initialPosts, pageSize]);

	const loadMore = useCallback(async () => {
		if (isLoading || !hasMore) return;

		if (posts.length >= maxPosts) {
			setHasMore(false);
			return;
		}

		setIsLoading(true);

		try {
			const newPosts = await loadMoreAction(page, pageSize, searchParams?.postName || "");

			if (newPosts.length === 0 || posts.length + newPosts.length >= maxPosts) {
				setHasMore(false);
			}

			const remainingSlots = maxPosts - posts.length;
			const postsToAdd = newPosts.slice(0, remainingSlots);

			setPosts((prev) => [...prev, ...postsToAdd]);
			setPage((prev) => prev + 1);

			if (postsToAdd.length < newPosts.length) {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading more posts:", error);
		} finally {
			setIsLoading(false);
		}
	}, [isLoading, hasMore, page, pageSize, loadMoreAction, searchParams?.postName, posts, maxPosts]);

	const { loadMoreRef } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore,
		isLoading,
		threshold: 300,
	});

	if (posts.length === 0 && !isLoading) {
		return <P className="text-muted-foreground">No se encontraron posts</P>;
	}

	return (
		<div className="space-y-4">
			<div className="grid gap-4">
				{posts.map((post) => (
					<PostCard key={post.id} className="w-full" post={post} />
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
			{!hasMore && posts.length > 0 && (
				<P className="text-center text-muted-foreground py-4">No hay más posts para mostrar</P>
			)}
		</div>
	);
}

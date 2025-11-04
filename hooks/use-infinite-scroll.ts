"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
	onLoadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
	threshold?: number;
}

export function useInfiniteScroll({ onLoadMore, hasMore, isLoading, threshold = 300 }: UseInfiniteScrollOptions) {
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0];
			if (target.isIntersecting && hasMore && !isLoading) {
				onLoadMore();
			}
		},
		[hasMore, isLoading, onLoadMore]
	);

	useEffect(() => {
		const element = loadMoreRef.current;
		if (!element) return;

		const option = {
			root: null,
			rootMargin: `${threshold}px`,
			threshold: 0,
		};

		observerRef.current = new IntersectionObserver(handleObserver, option);
		observerRef.current.observe(element);

		return () => {
			if (observerRef.current && element) {
				observerRef.current.unobserve(element);
			}
		};
	}, [handleObserver, threshold]);

	return { loadMoreRef };
}

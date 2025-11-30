"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";
import { TPost } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../cards/post-card";
import { B1 } from "../ui-custom/typography";

interface InfinitePostGridProps {
	className?: string;
	initialPosts: TPost[];
	loadMoreAction: (page: number, pageSize: number, postName?: string) => Promise<TPost[]>;
	searchParams?: {
		locale?: string;
		postName?: string;
	};
	pageSize?: number;
	maxPosts?: number;
	maxColumns?: number;
	userUuid?: string | null;
}

export function InfinitePostGrid({
	className,
	initialPosts,
	loadMoreAction,
	searchParams,
	pageSize = 5,
	maxPosts = Infinity,
	maxColumns = 3,
	userUuid,
}: InfinitePostGridProps) {
	const [posts, setPosts] = useState<TPost[]>(initialPosts);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(initialPosts.length >= pageSize);
	const [page, setPage] = useState(1);
	const [batchOffset, setBatchOffset] = useState(0);
	const [likeStates, setLikeStates] = useState<Record<number, boolean>>({});
	const [subscribeStates, setSubscribeStates] = useState<Record<number, boolean>>({});
	const gridRef = useRef<HTMLDivElement>(null);
	const measurementRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setPosts(initialPosts);
		setPage(1);
		setBatchOffset(0);
		setHasMore(initialPosts.length >= pageSize);
	}, [searchParams?.postName, initialPosts, pageSize]);

	// initialize states when posts change
	useEffect(() => {
		const initialLikes: Record<number, boolean> = {};
		const initialSubs: Record<number, boolean> = {};
		posts.forEach((post) => {
			initialLikes[post.id] =
				post.type === "Offer"
					? !!post.User_Offer?.some((u) => u.liked)
					: !!post.User_Petition?.some((u) => u.liked);

			initialSubs[post.id] =
				post.type === "Offer"
					? !!post.User_Offer?.some((u) => u.subscribed)
					: !!post.User_Petition?.some((u) => u.subscribed);
		});
		setLikeStates(initialLikes);
		setSubscribeStates(initialSubs);
	}, [posts]);

	const loadMore = useCallback(async () => {
		if (isLoading || !hasMore) return;

		setIsLoading(true);

		try {
			// calculate page considering batch offset
			const pagesPerBatch = Math.ceil(maxPosts / pageSize);
			const actualPage = batchOffset * pagesPerBatch + page;

			const newPosts = await loadMoreAction(actualPage, pageSize, searchParams?.postName || "");

			// if no new posts returned, we've reached the end
			if (newPosts.length === 0) {
				setHasMore(false);
				setIsLoading(false);
				return;
			}

			// filter out duplicates by checking existing post IDs
			setPosts((prev) => {
				const existingIds = new Set(prev.map((p) => p.id));
				const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));

				// check if we're at or over the maxPosts limit (if specified)
				const totalAfterAdd = prev.length + uniqueNewPosts.length;
				const shouldStopDueToLimit = maxPosts !== Infinity && totalAfterAdd >= maxPosts;

				// only add posts up to maxPosts limit (if specified)
				const remainingSlots = maxPosts !== Infinity ? maxPosts - prev.length : uniqueNewPosts.length;
				const postsToAdd = uniqueNewPosts.slice(0, remainingSlots);

				// set hasMore based on whether we hit the limit or ran out of posts
				if (shouldStopDueToLimit || uniqueNewPosts.length === 0) {
					setHasMore(false);
				} else if (newPosts.length < pageSize) {
					// backend returned fewer posts than requested, we're at the end
					setHasMore(false);
				}

				return [...prev, ...postsToAdd];
			});

			setPage((prev) => prev + 1);
		} catch (error) {
			console.error("Error loading more posts:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	}, [isLoading, hasMore, page, pageSize, loadMoreAction, searchParams?.postName, maxPosts, batchOffset]);

	// scroll-based trigger
	useEffect(() => {
		const checkScrollPosition = () => {
			if (!gridRef.current || !hasMore || isLoading) return;

			const scrollTop = window.scrollY;
			const viewportHeight = window.innerHeight;
			const gridTop = gridRef.current.offsetTop;
			const gridHeight = gridRef.current.offsetHeight;

			// calculate scroll progress (0 to 1)
			const scrollProgress = (scrollTop + viewportHeight - gridTop) / gridHeight;

			// trigger at X% scrolled
			if (scrollProgress >= 0.99) {
				loadMore();
			}
		};

		// check immediately at start in case we're already scrolled down
		checkScrollPosition();

		let rafId: number;
		const handleScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(checkScrollPosition);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [hasMore, isLoading, loadMore]);

	const { loadMoreRef } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore,
		isLoading,
		threshold: -1000, // effectively disable the IntersectionObserver
	});

	// custom virtualization: only render posts that might be visible
	const [visibleRange, setVisibleRange] = useState({ start: 0, end: 30 });
	const [measuredRowHeight, setMeasuredRowHeight] = useState(400);
	const BUFFER_ROWS = 3; // number of rows to render above and below viewport

	// measure PostCard height
	useEffect(() => {
		const updateHeight = () => {
			if (measurementRef.current) {
				const height = measurementRef.current.offsetHeight;
				if (height > 0) {
					setMeasuredRowHeight(height);
				}
			}
		};

		updateHeight(); // initial measurement

		const resizeObserver = new ResizeObserver(updateHeight);
		if (measurementRef.current) {
			resizeObserver.observe(measurementRef.current);
		}

		return () => resizeObserver.disconnect();
	}, [posts]);

	useEffect(() => {
		if (!gridRef.current) return;

		const updateVisibleRange = () => {
			if (!gridRef.current) return;

			const scrollTop = window.scrollY;
			const viewportHeight = window.innerHeight;
			const gridTop = gridRef.current.offsetTop;

			const itemsPerRow = maxColumns;
			const rowHeight = measuredRowHeight;

			// calculate visible rows with buffer
			const firstVisibleRow = Math.max(0, Math.floor((scrollTop - gridTop) / rowHeight) - BUFFER_ROWS);
			const lastVisibleRow = Math.ceil((scrollTop + viewportHeight - gridTop) / rowHeight) + BUFFER_ROWS;

			const start = firstVisibleRow * itemsPerRow;
			const end = Math.min(posts.length, (lastVisibleRow + 1) * itemsPerRow);

			const newStart = Math.max(0, start);
			const newEnd = end;

			// only update if range actually changed
			setVisibleRange((prev) => {
				if (prev.start !== newStart || prev.end !== newEnd) {
					console.log(`🔄 Virtualization: ${newEnd - newStart} posts rendered`);
					return { start: newStart, end: newEnd };
				}
				return prev;
			});
		};

		updateVisibleRange();

		// use requestAnimationFrame to debounce/dejitter scroll events
		let rafId: number;
		const handleScroll = () => {
			if (rafId) cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(updateVisibleRange);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });
		window.addEventListener("resize", updateVisibleRange);

		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			window.removeEventListener("scroll", handleScroll);
			window.removeEventListener("resize", updateVisibleRange);
		};
	}, [posts.length, maxColumns, measuredRowHeight, BUFFER_ROWS]);

	if (posts.length === 0 && !isLoading) {
		return <B1 className="text-lightgrey">No se encontraron posts</B1>;
	}

	// calculate grid rows for proper spacing
	const totalRows = Math.ceil(posts.length / maxColumns);
	const visiblePosts = posts.slice(visibleRange.start, visibleRange.end);
	const startRow = Math.floor(visibleRange.start / maxColumns);
	const endRow = Math.ceil(visibleRange.end / maxColumns);
	const topPadding = startRow * measuredRowHeight;
	const bottomPadding = Math.max(0, (totalRows - endRow) * measuredRowHeight);

	return (
		<div className="space-y-4">
			{/* Hidden measurement element for getting PostCard height */}
			<div ref={measurementRef} className="absolute opacity-0 pointer-events-none">
				{posts.length > 0 && <PostCard className="w-full" post={posts[0]} />}
			</div>

			<div ref={gridRef} className={cn("w-full", className)}>
				{/* Top spacer for virtualization (and to dejitter i believe) */}
				{topPadding > 0 && <div style={{ height: `${topPadding}px` }} />}

				{/* Grid layout */}
				<div
					className={cn(
						"grid gap-4",
						maxColumns === 1 && "grid-cols-1",
						maxColumns === 2 && "grid-cols-1 md:grid-cols-2",
						maxColumns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
						maxColumns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
					)}
				>
					{visiblePosts.map((post) => {
						const postKey = `${post.id}-${post.type}`;
						return (
							<PostCard
								key={postKey}
								className="w-full"
								post={post}
								userUuidProp={userUuid}
								likedByUser={likeStates[post.id]}
								onLikeChangeForParent={(liked) =>
									setLikeStates((prev) => ({
										...prev,
										[post.id]: liked,
									}))
								}
								subscribedByUser={subscribeStates[post.id]}
								onSubscribeChangeForParent={(subscribed) =>
									setSubscribeStates((prev) => ({
										...prev,
										[post.id]: subscribed,
									}))
								}
							/>
						);
					})}
				</div>

				{/* Bottom spacer for virtualization (and to dejitter i believe) */}
				{bottomPadding > 0 && <div style={{ height: `${bottomPadding}px` }} />}
			</div>

			{/* Sentinel for infinite scroll */}
			<div ref={loadMoreRef} className="py-8">
				{isLoading && (
					<div className="flex justify-center gap-2">
						<div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
						<div className="h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
						<div className="h-3 w-3 animate-bounce rounded-full bg-primary" />
					</div>
				)}
			</div>

			{/* Message when limit has been reached */}
			{!hasMore && posts.length > 0 && posts.length >= maxPosts && maxPosts !== Infinity && (
				<div className="text-center py-8 space-y-4">
					<B1 className="text-lightgrey">
						Has cargado {posts.length} posts (batch {batchOffset + 1}). ¿Quieres ver más?
					</B1>
					<div className="flex justify-center gap-4">
						{batchOffset > 0 && (
							<button
								onClick={() => {
									// move to previous batch
									const prevBatchOffset = batchOffset - 1;
									const pagesPerBatch = Math.ceil(maxPosts / pageSize);
									const nextStartPage = 1;
									const actualStartPage = prevBatchOffset * pagesPerBatch + nextStartPage;

									setBatchOffset(prevBatchOffset);
									setPosts([]);
									setPage(nextStartPage);
									setHasMore(true);
									setIsLoading(true);

									// scroll to top
									window.scrollTo({ top: 0, behavior: "smooth" });

									// trigger load immediately
									loadMoreAction(actualStartPage, pageSize, searchParams?.postName || "")
										.then((newPosts) => {
											if (newPosts.length > 0) {
												setPosts(newPosts);
												setPage(nextStartPage + 1);
												setHasMore(newPosts.length >= pageSize);
											} else {
												setHasMore(false);
											}
										})
										.catch((error) => {
											console.error("Error loading previous batch:", error);
											setHasMore(false);
										})
										.finally(() => {
											setIsLoading(false);
										});
								}}
								className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
							>
								← Volver a los {maxPosts} posts anteriores
							</button>
						)}
						<button
							onClick={() => {
								// move to next batch
								const nextBatchOffset = batchOffset + 1;
								const pagesPerBatch = Math.ceil(maxPosts / pageSize);
								const nextStartPage = 1;
								const actualStartPage = nextBatchOffset * pagesPerBatch + nextStartPage;

								setBatchOffset(nextBatchOffset);
								setPosts([]);
								setPage(nextStartPage);
								setHasMore(true);
								setIsLoading(true);

								// scroll to top
								window.scrollTo({ top: 0, behavior: "smooth" });

								// trigger load immediately
								loadMoreAction(actualStartPage, pageSize, searchParams?.postName || "")
									.then((newPosts) => {
										if (newPosts.length > 0) {
											setPosts(newPosts);
											setPage(nextStartPage + 1);
											setHasMore(newPosts.length >= pageSize);
										} else {
											setHasMore(false);
										}
									})
									.catch((error) => {
										console.error("Error loading next batch:", error);
										setHasMore(false);
									})
									.finally(() => {
										setIsLoading(false);
									});
							}}
							className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
						>
							Ir a los siguientes {maxPosts} posts →
						</button>
					</div>
				</div>
			)}

			{!hasMore && posts.length > 0 && posts.length < maxPosts && (
				<div className="text-center py-8 space-y-4">
					<B1 className="text-lightgrey">No hay más posts para mostrar</B1>
					{batchOffset > 0 && (
						<button
							onClick={() => {
								// move to previous batch
								const prevBatchOffset = batchOffset - 1;
								const pagesPerBatch = Math.ceil(maxPosts / pageSize);
								const nextStartPage = 1;
								const actualStartPage = prevBatchOffset * pagesPerBatch + nextStartPage;

								setBatchOffset(prevBatchOffset);
								setPosts([]);
								setPage(nextStartPage);
								setHasMore(true);
								setIsLoading(true);

								// scroll to top
								window.scrollTo({ top: 0, behavior: "smooth" });

								// trigger load immediately
								loadMoreAction(actualStartPage, pageSize, searchParams?.postName || "")
									.then((newPosts) => {
										if (newPosts.length > 0) {
											setPosts(newPosts);
											setPage(nextStartPage + 1);
											setHasMore(newPosts.length >= pageSize);
										} else {
											setHasMore(false);
										}
									})
									.catch((error) => {
										console.error("Error loading previous batch:", error);
										setHasMore(false);
									})
									.finally(() => {
										setIsLoading(false);
									});
							}}
							className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
						>
							← Volver a los {maxPosts} posts anteriores
						</button>
					)}
				</div>
			)}
		</div>
	);
}

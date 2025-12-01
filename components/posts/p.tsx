"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";
import { TPost } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import { PostCard } from "../cards/post-card";
import { B1 } from "../ui-custom/typography";

interface InfinitePostGridProps {
	className?: string;
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
	loadMoreAction,
	searchParams,
	pageSize = 5,
	maxPosts = 10,
	maxColumns = 3,
	userUuid,
}: InfinitePostGridProps) {
	// Validate and fix logic errors
	const validatedMaxPosts = maxPosts < pageSize 
		? (() => {
				console.error(`Logic error: maxPosts (${maxPosts}) is smaller than pageSize (${pageSize}). Setting maxPosts = pageSize.`);
				return pageSize;
		  })()
		: maxPosts;
	
	const [posts, setPosts] = useState<TPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	
	// NEW: Track the starting page of the current batch
	const [batchStartPage, setBatchStartPage] = useState(0);
	
	const [likeStates, setLikeStates] = useState<Record<number, boolean>>({});
	const [subscribeStates, setSubscribeStates] = useState<Record<number, boolean>>({});
	const gridRef = useRef<HTMLDivElement>(null);
	const measurementRef = useRef<HTMLDivElement>(null);
	
	// Track if there are batches ahead (for showing forward button)
	const [hasNextBatch, setHasNextBatch] = useState(false);

	// Load initial posts on mount and when search params change
	useEffect(() => {
		const loadInitialPosts = async () => {
			setIsLoading(true);
			setPosts([]);
			setPage(1);
			setBatchStartPage(0);
			setHasNextBatch(false);

			try {
				const initialPosts = await loadMoreAction(0, pageSize, searchParams?.postName || "");
				
				setPosts(initialPosts);
				setPage(1);
				setHasMore(initialPosts.length >= pageSize && initialPosts.length < validatedMaxPosts);
				
				// If we got a full page, there might be more
				if (initialPosts.length >= pageSize) {
					setHasNextBatch(true);
				}
			} catch (error) {
				console.error("Error loading initial posts:", error);
				setHasMore(false);
			} finally {
				setIsLoading(false);
			}
		};

		loadInitialPosts();
	}, [searchParams?.postName, pageSize, validatedMaxPosts, loadMoreAction]);

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
			const newPosts = await loadMoreAction(page, pageSize, searchParams?.postName || "");

			// if no new posts returned, we've reached the end of the database
			if (newPosts.length === 0) {
				setHasMore(false);
				setIsLoading(false);
				return;
			}

			// filter out duplicates by checking existing post IDs
			let shouldContinueLoading = true;
			let hasOverflow = false;
			
			setPosts((prev) => {
				const existingIds = new Set(prev.map((p) => p.id));
				const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));

				// only add posts up to maxPosts limit
				const remainingSlots = validatedMaxPosts !== Infinity ? validatedMaxPosts - prev.length : uniqueNewPosts.length;
				const postsToAdd = uniqueNewPosts.slice(0, remainingSlots);
				
				// Check if we have overflow (more posts available than we can show)
				hasOverflow = uniqueNewPosts.length > remainingSlots;

				const totalAfterAdd = prev.length + postsToAdd.length;

				// determine if we should continue loading
				if (validatedMaxPosts !== Infinity && totalAfterAdd >= validatedMaxPosts) {
					// We've hit the maxPosts limit for this batch
					// If we have overflow or backend returned full page, there's a next batch
					if (hasOverflow || newPosts.length >= pageSize) {
						shouldContinueLoading = false;
					} else {
						shouldContinueLoading = false;
					}
				} else if (uniqueNewPosts.length === 0) {
					shouldContinueLoading = false;
				} else if (newPosts.length < pageSize) {
					// backend returned fewer posts than requested, we're at the end
					shouldContinueLoading = false;
				}

				return [...prev, ...postsToAdd];
			});

			// If we have overflow or got full page, there's a next batch
			if (hasOverflow || newPosts.length >= pageSize) {
				setHasNextBatch(true);
			}
			
			setHasMore(shouldContinueLoading);
			setPage((prev) => prev + 1);
		} catch (error) {
			console.error("Error loading more posts:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	}, [isLoading, hasMore, page, pageSize, loadMoreAction, searchParams?.postName, validatedMaxPosts]);

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

	// Helper function to load next batch - continues from where we left off
	const loadNextBatch = async () => {
		// The next batch starts from the current page (where we left off)
		const nextBatchStartPage = page;
		
		setBatchStartPage(nextBatchStartPage);
		setPosts([]);
		setPage(nextBatchStartPage);
		setHasMore(true);
		setIsLoading(true);
		setHasNextBatch(false);

		// scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });

		try {
			let allPosts: TPost[] = [];
			let currentPage = nextBatchStartPage;
			
			// Keep loading until we have maxPosts or run out of posts
			while (allPosts.length < validatedMaxPosts) {
				const newPosts = await loadMoreAction(currentPage, pageSize, searchParams?.postName || "");
				
				if (newPosts.length === 0) {
					break;
				}
				
				// Filter out duplicates
				const existingIds = new Set(allPosts.map((p) => p.id));
				const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
				
				// Add posts up to maxPosts limit
				const remainingSlots = validatedMaxPosts - allPosts.length;
				const postsToAdd = uniqueNewPosts.slice(0, remainingSlots);
				allPosts = [...allPosts, ...postsToAdd];
				
				// If we got fewer posts than requested, we've reached the end
				if (newPosts.length < pageSize) {
					break;
				}
				
				currentPage++;
			}
			
			if (allPosts.length > 0) {
				setPosts(allPosts);
				setPage(currentPage);
				// If we loaded exactly maxPosts and got full pages, there might be more
				setHasMore(allPosts.length < validatedMaxPosts);
				// Mark that we might have a next batch if we loaded maxPosts
				if (allPosts.length >= validatedMaxPosts) {
					setHasNextBatch(true);
				}
			} else {
				setPosts([]);
				setHasMore(false);
				setHasNextBatch(false);
			}
		} catch (error) {
			console.error("Error loading next batch:", error);
			setHasMore(false);
			setHasNextBatch(false);
		} finally {
			setIsLoading(false);
		}
	};

	// Helper function to load previous batch - goes back to the start page of previous batch
	const loadPrevBatch = async () => {
		// Calculate how many pages we loaded in the current batch
		const pagesInCurrentBatch = page - batchStartPage;
		
		// The previous batch should start from one batch's worth of pages before current batch start
		const prevBatchStartPage = Math.max(0, batchStartPage - pagesInCurrentBatch);

		setBatchStartPage(prevBatchStartPage);
		setPosts([]);
		setPage(prevBatchStartPage);
		setHasMore(true);
		setIsLoading(true);
		setHasNextBatch(true); // We know there's a next batch (the one we came from)

		// scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });

		try {
			let allPosts: TPost[] = [];
			let currentPage = prevBatchStartPage;
			
			// Keep loading until we have maxPosts or run out of posts
			while (allPosts.length < validatedMaxPosts) {
				const newPosts = await loadMoreAction(currentPage, pageSize, searchParams?.postName || "");
				
				if (newPosts.length === 0) {
					break;
				}
				
				// Filter out duplicates
				const existingIds = new Set(allPosts.map((p) => p.id));
				const uniqueNewPosts = newPosts.filter((p) => !existingIds.has(p.id));
				
				// Add posts up to maxPosts limit
				const remainingSlots = validatedMaxPosts - allPosts.length;
				const postsToAdd = uniqueNewPosts.slice(0, remainingSlots);
				allPosts = [...allPosts, ...postsToAdd];
				
				// If we got fewer posts than requested, we've reached the end
				if (newPosts.length < pageSize) {
					break;
				}
				
				currentPage++;
			}
			
			if (allPosts.length > 0) {
				setPosts(allPosts);
				setPage(currentPage);
				setHasMore(allPosts.length < validatedMaxPosts);
			} else {
				setPosts([]);
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading previous batch:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
		}
	};

	if (posts.length === 0 && !isLoading) {
		if (batchStartPage > 0) {
			return (
				<div className="text-center py-8 space-y-4">
					<B1 className="text-lightgrey">No hay más posts disponibles</B1>
					<button
						onClick={loadPrevBatch}
						className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
					>
						← Volver a los {validatedMaxPosts} posts anteriores
					</button>
				</div>
			);
		}
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
				{/* Top spacer for virtualization */}
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

				{/* Bottom spacer for virtualization */}
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
			{!hasMore && posts.length > 0 && posts.length >= validatedMaxPosts && validatedMaxPosts !== Infinity && (
				<div className="text-center py-8 space-y-4">
					<B1 className="text-lightgrey">
						Has cargado {posts.length} posts. ¿Quieres ver más?
					</B1>
					<div className="flex justify-center gap-4">
						{batchStartPage > 0 && (
							<button
								onClick={loadPrevBatch}
								className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
							>
								← Volver a los {validatedMaxPosts} posts anteriores
							</button>
						)}
						<button
							onClick={loadNextBatch}
							className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
						>
							Ir a los siguientes {validatedMaxPosts} posts →
						</button>
					</div>
				</div>
			)}

			{/* End of posts - show appropriate message and navigation */}
			{!hasMore && posts.length > 0 && posts.length < validatedMaxPosts && (
				<div className="text-center py-8 space-y-4">
					<B1 className="text-lightgrey">
						{posts.length === 1 
							? "Solo hay 1 post para mostrar" 
							: `Mostrando ${posts.length} posts`}
					</B1>
					<div className="flex justify-center gap-4">
						{batchStartPage > 0 && (
							<button
								onClick={loadPrevBatch}
								className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
							>
								← Volver a los {validatedMaxPosts} posts anteriores
							</button>
						)}
						{hasNextBatch && (
							<button
								onClick={loadNextBatch}
								className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
							>
								Ir a los siguientes {validatedMaxPosts} posts →
							</button>
						)}
					</div>
				</div>
			)}

			{/* Reached the end with no posts in batch */}
			{!hasMore && posts.length === 0 && !isLoading && batchStartPage > 0 && (
				<div className="text-center py-8 space-y-4">
					<B1 className="text-lightgrey">No hay más posts disponibles</B1>
					<button
						onClick={loadPrevBatch}
						className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
					>
						← Volver a los {validatedMaxPosts} posts anteriores
					</button>
				</div>
			)}
		</div>
	);
}
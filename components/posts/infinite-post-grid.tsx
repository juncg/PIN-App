"use client";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";
import { TPost } from "@/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

function validateMaxPosts(maxPosts: number, pageSize: number): number {
	if (maxPosts === Infinity) return Infinity;
	
	// check if maxPosts is smaller than pageSize
	if (maxPosts < pageSize) {
		console.error(`Logic error: maxPosts (${maxPosts}) is smaller than pageSize (${pageSize}). Setting maxPosts = pageSize.`);
		return pageSize;
	}
	
	// round up to nearest multiple of pageSize
	const remainder = maxPosts % pageSize;
	if (remainder === 0) {
		return maxPosts;
	} else {
		const adjusted = maxPosts + (pageSize - remainder);
		console.error(
			`maxPosts (${maxPosts}) adjusted to ${adjusted} to be divisible by pageSize (${pageSize})`
		);
		return adjusted;
	}
}

export function InfinitePostGrid({
	className,
	loadMoreAction,
	searchParams,
	pageSize = 5,
	maxPosts = 100000,	// about 200mb at ~2kb a post
	maxColumns = 3,
	userUuid,
}: InfinitePostGridProps) {
	if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('🔵 InfinitePostGrid MOUNTED/RENDERED');

	// only validate when maxPosts or pageSize actually change
	const validatedMaxPosts = useMemo(() => {
		return validateMaxPosts(maxPosts, pageSize);
	}, [maxPosts, pageSize]);
	
	const [posts, setPosts] = useState<TPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasMore, setHasMore] = useState(true);
	const [page, setPage] = useState(1);
	
	// track the starting page of the current batch
	const [batchStartPage, setBatchStartPage] = useState(0);
	
	const [likeStates, setLikeStates] = useState<Record<number, boolean>>({});
	const [subscribeStates, setSubscribeStates] = useState<Record<number, boolean>>({});

	// track which posts the user has interacted with (client-side changes)
	const interactedPostIds = useRef<Set<number>>(new Set());

	const gridRef = useRef<HTMLDivElement>(null);
	const measurementRef = useRef<HTMLDivElement>(null);
	
	// track if there are batches ahead (for showing forward button)
	const [hasNextBatch, setHasNextBatch] = useState(false);

	// to prevent concurrent loads
	const isLoadingRef = useRef(false);

	// load initial posts on mount and when search params change
	useEffect(() => {
		if (isLoadingRef.current) {
			return;
		}
		isLoadingRef.current = true;

		if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('🟢 useEffect FIRED for initial load');

		const loadInitialPosts = async () => {
			setIsLoading(true);
			setPosts([]);
			setPage(1);
			if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('setting page to', page);
			setBatchStartPage(0);
			setHasNextBatch(false);

			try {
				if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('🟡 loadInitialPosts CALLED');
				const initialPosts = await loadMoreAction(0, pageSize, searchParams?.postName || "");
				if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('🟡 loadInitialPosts RETURNED', initialPosts.length, 'posts');
				
				setPosts(initialPosts);
				setHasMore(initialPosts.length >= pageSize && initialPosts.length < validatedMaxPosts);

			} catch (error) {
				console.error("Error loading initial posts:", error);
				setHasMore(false);
			} finally {
				setIsLoading(false);
				isLoadingRef.current = false;
			}
		};

		loadInitialPosts();
	}, []);

	// initialize states at the start
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
	}, []);

	const loadMore = useCallback(async () => {
		if (isLoadingRef.current || !hasMore) {
			return;
		}
		isLoadingRef.current = true;

		setIsLoading(true);

		try {
			let removedPosts = false;

			let newPosts = await loadMoreAction(page, pageSize, searchParams?.postName || "");
			// filter out interacted posts
			newPosts = newPosts.filter(post => {
				if (interactedPostIds.current.has(post.id)) {
					if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log("!!!!!!!!!!!!! Filtered out post:", post);
					removedPosts = true;
					return false;
				}
				if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log("Kept post:", post);
				return true;
			});

			// if no new posts returned, we've reached the end of the database
			if (newPosts.length === 0 && !removedPosts) {
				setHasMore(false);
				setIsLoading(false);
				return;
			}

			let shouldContinueLoading = true;
			
			setPosts((prev) => {
				const totalAfterAdd = prev.length + newPosts.length;

				// determine if we should continue loading
				if (validatedMaxPosts !== Infinity && totalAfterAdd >= validatedMaxPosts) {
					shouldContinueLoading = false;
				} else if (newPosts.length < pageSize && !removedPosts) {
					// backend returned fewer posts than requested, we're at the end
					shouldContinueLoading = false;
				}

				return [...prev, ...newPosts];
			});

			// if we got full page, there might be more
			if (newPosts.length >= pageSize || removedPosts) {
				setHasNextBatch(true);
			}
			
			setHasMore(shouldContinueLoading);
			setPage((prev) => prev + 1);
			if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('setting page to', page);
		} catch (error) {
			console.error("Error loading more posts:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
			isLoadingRef.current = false;
		}
	}, [isLoading, hasMore, page, pageSize, loadMoreAction, searchParams?.postName, validatedMaxPosts]);

	const { loadMoreRef } = useInfiniteScroll({
		onLoadMore: loadMore,
		hasMore,
		isLoading,
		threshold: 100, // effectively disable the IntersectionObserver
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

	// update visible range on scroll
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
					if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log(`🔄 Virtualization: ${newEnd - newStart} posts rendered`);
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

	// helper function to load next batch, continues from where we left off
	const loadNextBatch = async () => {
		if (isLoadingRef.current) {
			return;
		}
		isLoadingRef.current = true;

		// the next batch starts from the current page (where we left off)
		const nextBatchStartPage = page;
		
		setBatchStartPage(nextBatchStartPage);
		setPosts([]);
		setPage(nextBatchStartPage);
		if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('setting page to', page);
		setHasMore(true);
		setIsLoading(true);
		setHasNextBatch(false);

		interactedPostIds.current.clear();

		// scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });

		try {
			// just load the first page of the new batch
			const newPosts = await loadMoreAction(nextBatchStartPage, pageSize, searchParams?.postName || "");
			
			if (newPosts.length > 0) {
				setPosts(newPosts);
				setPage(nextBatchStartPage + 1);
				if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('setting page to', page);
				// can load more if we got a full page and haven't hit maxPosts yet
				setHasMore(newPosts.length >= pageSize && newPosts.length < validatedMaxPosts);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading next batch:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
			isLoadingRef.current = false;
		}
	};

	// helper function to load previous batch
	const loadPrevBatch = async () => {
		if (isLoadingRef.current) {
			return;
		}
		isLoadingRef.current = true;

		// calculate pages needed for a full batch
		const pagesPerFullBatch = Math.ceil(validatedMaxPosts / pageSize);
		
		// go back by that many pages
		const prevBatchStartPage = Math.max(0, batchStartPage - pagesPerFullBatch);

		setBatchStartPage(prevBatchStartPage);
		setPosts([]);
		setPage(prevBatchStartPage);
		if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('setting page to', page);
		setHasMore(true);
		setIsLoading(true);
		setHasNextBatch(true); // we know there's a next batch (the one we came from)

		interactedPostIds.current.clear();

		// scroll to top
		window.scrollTo({ top: 0, behavior: "smooth" });

		try {
			// just load the first page of the previous batch
			const newPosts = await loadMoreAction(prevBatchStartPage, pageSize, searchParams?.postName || "");
			
			if (newPosts.length > 0) {
				setPosts(newPosts);
				setPage(prevBatchStartPage + 1);
				if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log('setting page to', page);
				// can load more if we got a full page and haven't hit maxPosts yet
				setHasMore(newPosts.length >= pageSize && newPosts.length < validatedMaxPosts);
			} else {
				setPosts([]);
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading previous batch:", error);
			setHasMore(false);
		} finally {
			setIsLoading(false);
			isLoadingRef.current = false;
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
								onLikeChangeForParent={(liked) => {
									// mark post as interacted with
									interactedPostIds.current.add(post.id);
									if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log("post ids interacted with", interactedPostIds.current);
									setLikeStates((prev) => ({
										...prev,
										[post.id]: liked,
									}));
								}}
								subscribedByUser={subscribeStates[post.id]}
								onSubscribeChangeForParent={(subscribed) => {
									// mark post as interacted with
									interactedPostIds.current.add(post.id);
									if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") console.log("post ids interacted with",interactedPostIds.current);
									setSubscribeStates((prev) => ({
										...prev,
										[post.id]: subscribed,
									}));
								}}
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
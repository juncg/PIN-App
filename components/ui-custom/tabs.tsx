"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
	return <TabsPrimitive.Root data-slot="tabs" className={cn("flex flex-col gap-2", className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"bg-hover border border-cardborder inline-flex h-auto w-full items-center justify-center rounded-lg p-1",
				className
			)}
			{...props}
		/>
	);
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"inline-flex h-auto flex-1 items-center justify-center gap-2 rounded-md border border-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-all",
				"text-lightgrey hover:text-white",
				"data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-cardborder",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chernobyl focus-visible:ring-offset-2 focus-visible:ring-offset-darkmode",
				"disabled:pointer-events-none disabled:opacity-50",
				"[&_svg]:pointer-events-none [&_svg]:shrink-0",
				className
			)}
			{...props}
		/>
	);
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content data-slot="tabs-content" className={cn("flex-1 outline-none", className)} {...props} />
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };

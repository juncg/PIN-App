import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, ComponentProps<"input">>(
	({ className, type, children, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-9 w-full rounded-3xl border border-hover bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-placeholder focus-visible:outline-none focus-visible:border-white disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);

Input.displayName = "Input";

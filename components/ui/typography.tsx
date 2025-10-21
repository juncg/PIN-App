import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ITypography {
	children?: ReactNode;
	className?: string;
}

export function H1({ children, className }: ITypography) {
	return (
		<h1 className={cn("scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance", className)}>
			{children}
		</h1>
	);
}

export function H2({ children, className }: ITypography) {
	return (
		<h2 className={cn("scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}>
			{children}
		</h2>
	);
}

export function H3({ children, className }: ITypography) {
	return <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)}>{children}</h3>;
}

export function H4({ children, className }: ITypography) {
	return <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)}>{children}</h4>;
}

export function P({ children, className }: ITypography) {
	return <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}>{children}</p>;
}

export function Blockquote({ children, className }: ITypography) {
	return <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)}>{children}</blockquote>;
}

export function List({ children, className }: ITypography) {
	return <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}>{children}</ul>;
}

export function InlineCode({ children, className }: ITypography) {
	return (
		<code
			className={cn(
				"bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
				className
			)}>
			{children}
		</code>
	);
}

export function Muted({ children, className }: ITypography) {
	return <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>;
}

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ITypography {
	children?: ReactNode;
	className?: string;
}

export function H1({ children, className }: ITypography) {
	return (
		<h1
			className={cn(
				"font-funnel-display scroll-m-20 text-5xl font-extrabold tracking-tight text-balance",
				className
			)}
		>
			{children}
		</h1>
	);
}

export function H2({ children, className }: ITypography) {
	return (
		<h2 className={cn("font-funnel-display scroll-m-20 text-3xl font-semibold tracking-tight", className)}>
			{children}
		</h2>
	);
}

export function H3({ children, className }: ITypography) {
	return (
		<h3 className={cn("font-funnel-display scroll-m-20 text-2xl font-semibold tracking-tight", className)}>
			{children}
		</h3>
	);
}

export function H4({ children, className }: ITypography) {
	return (
		<h4 className={cn("font-funnel-display scroll-m-20 text-xl font-semibold tracking-tight", className)}>
			{children}
		</h4>
	);
}

export function P({ children, className }: ITypography) {
	return <p className={cn("font-funnel-sans leading-7 text-base", className)}>{children}</p>;
}

export function Blockquote({ children, className }: ITypography) {
	return <blockquote className={cn("font-funnel-sans border-l-2 pl-6", className)}>{children}</blockquote>;
}

export function XLarge({ children, className }: ITypography) {
	return <p className={cn("font-funnel-sans leading-7 text-xl font-semibold", className)}>{children}</p>;
}

export function Large({ children, className }: ITypography) {
	return <p className={cn("font-funnel-sans leading-7 text-lg font-semibold", className)}>{children}</p>;
}

export function Small({ children, className }: ITypography) {
	return <p className={cn("font-funnel-sans leading-7 text-sm font-medium", className)}>{children}</p>;
}

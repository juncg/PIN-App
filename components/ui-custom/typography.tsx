import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ITypography {
	children?: ReactNode;
	className?: string;
}

export function H1({ children, className }: ITypography) {
	return (
		<h1
			className={cn("font-funnel-display scroll-m-20 text-5xl font-bold text-white whitespace-normal", className)}
		>
			{children}
		</h1>
	);
}

export function H2({ children, className }: ITypography) {
	return (
		<h2
			className={cn(
				"font-funnel-display scroll-m-20 text-4xl font-semibold text-white whitespace-normal",
				className
			)}
		>
			{children}
		</h2>
	);
}

export function H3({ children, className }: ITypography) {
	return (
		<h3
			className={cn("font-funnel-display scroll-m-20 text-3xl font-bold text-white whitespace-normal", className)}
		>
			{children}
		</h3>
	);
}

export function H4({ children, className }: ITypography) {
	return (
		<h4
			className={cn("font-funnel-display scroll-m-20 text-2xl font-bold text-white whitespace-normal", className)}
		>
			{children}
		</h4>
	);
}

export function H5DisplayBold({ children, className }: ITypography) {
	return (
		<h5 className={cn(className, "font-funnel-display font-bold scroll-m-20 text-xl text-white whitespace-normal")}>
			{children}
		</h5>
	);
}

export function H5SansSemiBold({ children, className }: ITypography) {
	return (
		<h5
			className={cn(className, "font-funnel-sans font-semibold scroll-m-20 text-xl text-white whitespace-normal")}
		>
			{children}
		</h5>
	);
}

export function S1({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-lg font-bold text-white whitespace-normal", className)}>
			{children}
		</p>
	);
}

export function S2({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-lg text-darkgrey whitespace-normal", className)}>
			{children}
		</p>
	);
}

export function S2MutedLineThrough({ children, className }: ITypography) {
	return (
		<p
			className={cn(
				"font-funnel-sans leading-7 text-lg text-lightgrey line-through whitespace-normal",
				className
			)}
		>
			{children}
		</p>
	);
}

export function B1({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-base font-medium text-white whitespace-normal", className)}>
			{children}
		</p>
	);
}

export function B2({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-base font-semibold text-white whitespace-normal", className)}>
			{children}
		</p>
	);
}

export function B3({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-base text-lightgrey whitespace-normal", className)}>
			{children}
		</p>
	);
}

export function B4({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-base text-lightgrey whitespace-normal", className)}>
			{children}
		</p>
	);
}

export function B5({ children, className }: ITypography) {
	return (
		<p className={cn("font-funnel-sans leading-7 text-sm text-darkgrey whitespace-normal", className)}>
			{children}
		</p>
	);
}

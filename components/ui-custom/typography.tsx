import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ITypography {
	children?: ReactNode;
	className?: string;
}

export const typography = {
	H1: "font-funnel-display scroll-m-20 text-5xl font-bold text-white whitespace-normal",
	H2: "font-funnel-display scroll-m-20 text-4xl font-semibold text-white whitespace-normal",
	H3: "font-funnel-display scroll-m-20 text-3xl font-bold text-white whitespace-normal",
	H4: "font-funnel-display scroll-m-20 text-2xl font-bold text-white whitespace-normal",
	H5DisplayBold: "font-funnel-display font-bold scroll-m-20 text-xl text-white whitespace-normal",
	H5SansSemiBold: "font-funnel-sans font-semibold scroll-m-20 text-xl text-white whitespace-normal",
	S1: "font-funnel-sans leading-7 text-lg font-bold text-white whitespace-normal",
	S2: "font-funnel-sans leading-7 text-lg text-darkgrey whitespace-normal",
	S2MutedLineThrough: "font-funnel-sans leading-7 text-lg text-lightgrey line-through whitespace-normal",
	B1: "font-funnel-sans leading-7 text-base font-medium text-white whitespace-normal",
	B2: "font-funnel-sans leading-7 text-base font-semibold text-white whitespace-normal",
	B3: "font-funnel-sans leading-7 text-base text-lightgrey whitespace-normal",
	B4: "font-funnel-sans leading-7 text-base text-lightgrey whitespace-normal",
	B5: "font-funnel-sans leading-7 text-sm text-darkgrey whitespace-normal",
};

export function H1({ children, className }: ITypography) {
	return <h1 className={cn(typography.H1, className)}>{children}</h1>;
}

export function H2({ children, className }: ITypography) {
	return <h2 className={cn(typography.H2, className)}>{children}</h2>;
}

export function H3({ children, className }: ITypography) {
	return <h3 className={cn(typography.H3, className)}>{children}</h3>;
}

export function H4({ children, className }: ITypography) {
	return <h4 className={cn(typography.H4, className)}>{children}</h4>;
}

export function H5DisplayBold({ children, className }: ITypography) {
	return <h5 className={cn(typography.H5DisplayBold, className)}>{children}</h5>;
}

export function H5SansSemiBold({ children, className }: ITypography) {
	return <h5 className={cn(typography.H5SansSemiBold, className)}>{children}</h5>;
}

export function S1({ children, className }: ITypography) {
	return <p className={cn(typography.S1, className)}>{children}</p>;
}

export function S2({ children, className }: ITypography) {
	return <p className={cn(typography.S2, className)}>{children}</p>;
}

export function S2MutedLineThrough({ children, className }: ITypography) {
	return <p className={cn(typography.S2MutedLineThrough, className)}>{children}</p>;
}

export function B1({ children, className }: ITypography) {
	return <p className={cn(typography.B1, className)}>{children}</p>;
}

export function B2({ children, className }: ITypography) {
	return <p className={cn(typography.B2, className)}>{children}</p>;
}

export function B3({ children, className }: ITypography) {
	return <p className={cn(typography.B3, className)}>{children}</p>;
}

export function B4({ children, className }: ITypography) {
	return <p className={cn(typography.B4, className)}>{children}</p>;
}

export function B5({ children, className }: ITypography) {
	return <p className={cn(typography.B5, className)}>{children}</p>;
}

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ITypography {
	children?: ReactNode;
	className?: string;
}

export function H1({ children, className }: ITypography) {
	return <h1 className={cn("font-funnel-display scroll-m-20 text-4xl font-bold", className)}>{children}</h1>;
}

export function H2({ children, className }: ITypography) {
	return <h2 className={cn("font-funnel-display scroll-m-20 text-4xl font-semibold", className)}>{children}</h2>;
}

export function H3({ children, className }: ITypography) {
	return <h3 className={cn("font-funnel-display scroll-m-20 text-3xl font-bold", className)}>{children}</h3>;
}

export function H4({ children, className }: ITypography) {
	return <h4 className={cn("font-funnel-display scroll-m-20 text-2xl font-bold", className)}>{children}</h4>;
}

function H5({ children, className }: ITypography) {
	return <h5 className={cn("scroll-m-20 text-xl", className)}>{children}</h5>;
}

export function H5DisplayBold({ children, className }: ITypography) {
	return <H5 className={cn(className, "!font-funnel-display !font-bold")}>{children}</H5>;
}

export function H5SansSemiBold({ children, className }: ITypography) {
	return <H5 className={cn(className, "!font-funnel-sans !font-semibold")}>{children}</H5>;
}

export function P({ children, className }: ITypography) {
	return <p className={cn("font-funnel-display leading-7 text-base", className)}>{children}</p>;
}

export function Blockquote({ children, className }: ITypography) {
	return <blockquote className={cn("font-funnel-display border-l-2 pl-6", className)}>{children}</blockquote>;
}

export function XLarge({ children, className }: ITypography) {
	return <p className={cn("font-funnel-display leading-7 text-xl font-semibold", className)}>{children}</p>;
}

export function Large({ children, className }: ITypography) {
	return <p className={cn("font-funnel-display leading-7 text-lg font-semibold", className)}>{children}</p>;
}

export function Small({ children, className }: ITypography) {
	return <p className={cn("font-funnel-display leading-7 text-sm font-medium", className)}>{children}</p>;
}

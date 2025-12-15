import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";

export const inputVariants = cva(
	"flex w-full bg-transparent text-white text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-base",
	{
		variants: {
			variant: {
				default: "rounded-3xl border border-hover focus-visible:border-white",
				squared: "rounded-md border border-hover focus-visible:border-white",
				outline: "rounded-3xl border border-white focus-visible:border-chernobyl",
				outlineSquared: "rounded-lg border border-white focus-visible:border-chernobyl",
				ghost: "border-0 focus-visible:bg-hover",
				chernobyl: "rounded-3xl border border-chernobyl focus-visible:border-white",
			},
			inputSize: {
				default: "h-9 px-3 py-1",
				sm: "h-8 px-2 py-0.5 text-sm",
				lg: "h-11 px-4 py-2 text-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			inputSize: "default",
		},
	}
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type, variant, inputSize, ...props }, ref) => {
		return (
			<input type={type} className={cn(inputVariants({ variant, inputSize, className }))} ref={ref} {...props} />
		);
	}
);

Input.displayName = "Input";

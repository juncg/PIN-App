import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const buttonVariants = cva(
	[
		"inline-flex items-center justify-center gap-2",
		"whitespace-nowrap rounded-md text-base font-medium",
		"transition-colors focus-visible:outline-none",
		"focus-visible:ring-1 focus-visible:ring-lightgrey",
		"disabled:pointer-events-none disabled:opacity-50",
		"[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	].join(" "),
	{
		variants: {
			variant: {
				default: "bg-white text-black rounded-full hover:scale-105 transition border-[2px] border-white",
				defaultSquared: "bg-white text-black rounded-lg hover:scale-105 transition border-[2px] border-white",
				outline: "bg-transparent text-white rounded-full hover:scale-105 transition border-[2px] border-white",
				outlineSquared: [
					"bg-hover text-white rounded-lg",
					"hover:scale-105 transition",
					"border-[2px] border-cardborder",
				].join(" "),
				ghost: "hover:bg-hover hover:text-gray-600 rounded-full",
				ghostSquared: "hover:bg-hover hover:text-gray-600 rounded-lg",
				chernobyl: [
					"bg-transparent text-black",
					"hover:scale-105 transition",
					"bg-[linear-gradient(160deg,var(--chernobyl)_0%,var(--lightgrey)_80%)]",
					"rounded-full",
				].join(" "),
				chernobylSquared: [
					"bg-transparent text-black",
					"hover:scale-105 transition",
					"bg-[linear-gradient(160deg,var(--chernobyl)_0%,var(--lightgrey)_80%)]",
					"rounded-lg",
				].join(" "),
				chernobylOutline: [
					"bg-transparent text-chernobyl",
					"hover:scale-105 transition",
					"border-[2px] border-chernobyl",
					"rounded-full",
				].join(" "),
				chernobylOutlineSquared: [
					"bg-transparent text-chernobyl",
					"hover:scale-105 transition",
					"border-[2px] border-chernobyl",
					"rounded-lg",
				].join(" "),
				destructive: "bg-destructive text-white hover:scale-105 transition rounded-full",
				destructiveSquared: "bg-destructive text-white hover:scale-105 transition rounded-lg",
			},
			size: {
				default: "h-9 px-7 py-3.5",
				sm: "h-8 px-3",
				lg: "h-10 px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	}
);
Button.displayName = "Button";

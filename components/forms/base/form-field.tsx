import { Label } from "@/components/ui-custom/label";
import { Small } from "@/components/ui-custom/typography";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IFormField {
	className?: string;
	label?: string;
	children: ReactNode;
	errorMessage?: string;
	htmlFor?: string;
}

export function FormField({ children, errorMessage, className, label, htmlFor }: IFormField) {
	return (
		<div className={cn("grid gap-2", className)}>
			{label && <Label htmlFor={htmlFor}>{label}</Label>}
			{children}
			{errorMessage && <Small className="!text-destructive">{errorMessage}</Small>}
		</div>
	);
}

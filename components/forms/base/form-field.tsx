import { Label } from "@/components/ui-custom/label";
import { B5 } from "@/components/ui-custom/typography";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface IFormField {
	className?: string;
	required?: boolean;
	label?: string;
	children: ReactNode;
	errorMessage?: string;
	htmlFor?: string;
}

export function FormField({ children, required = false, errorMessage, className, label, htmlFor }: IFormField) {
	return (
		<div className={cn("grid gap-2", className)}>
			{label && (
				<Label className="flex items-center gap-0.5" htmlFor={htmlFor}>
					{label}
					{required && <Label className="!text-destructive">*</Label>}
				</Label>
			)}
			{children}
			{errorMessage && <B5 className="!text-destructive">{errorMessage}</B5>}
		</div>
	);
}

"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

type TSonner = "Success" | "Error" | "Info" | "Warning" | "Loading";

export interface ISonner {
	title: string;
	description?: string;
	type?: TSonner;
}

export function Toaster({ ...props }: ToasterProps) {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			richColors
			className="toaster"
			icons={{
				success: <CircleCheckIcon className="size-4" />,
				info: <InfoIcon className="size-4" />,
				warning: <TriangleAlertIcon className="size-4" />,
				error: <OctagonXIcon className="size-4" />,
				loading: <Loader2Icon className="size-4 animate-spin" />,
			}}
			toastOptions={{
				classNames: {
					toast: "bg-popover text-popover-foreground border border-border rounded-md shadow-sm",
					success: "bg-primary text-primary-foreground",
					error: "bg-destructive text-destructive-foreground",
					warning: "bg-accent text-accent-foreground",
					info: "bg-secondary text-secondary-foreground",
					loading: "bg-popover text-popover-foreground",
					title: "font-medium",
					description: "text-sm opacity-90",
					actionButton: "btn btn-sm",
					cancelButton: "btn btn-sm btn-outline",
				},
				style: {
					background: "hsl(var(--popover))",
					color: "hsl(var(--popover-foreground))",
					border: "1px solid hsl(var(--border))",
					borderRadius: "var(--radius)",
				},
			}}
			style={
				{
					"--normal-bg": "hsl(var(--popover))",
					"--normal-text": "hsl(var(--popover-foreground))",
					"--normal-border": "hsl(var(--border))",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
}

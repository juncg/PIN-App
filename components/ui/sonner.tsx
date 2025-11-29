"use client";

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
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
					toast: "bg-black text-white border border-hover rounded-md shadow-sm",
					success: "bg-black text-black",
					error: "bg-destructive text-destructive",
					warning: "bg-hover text-hover",
					info: "bg-black text-white",
					loading: "bg-black text-white",
					title: "font-medium",
					description: "text-sm opacity-90",
					actionButton: "btn btn-sm",
					cancelButton: "btn btn-sm btn-outline",
				},
				style: {
					black: "hsl(var(--black))",
					color: "hsl(var(--white))",
					border: "1px solid hsl(var(--border))",
					borderRadius: "var(--radius)",
				},
			}}
			style={
				{
					"--normal-bg": "hsl(var(--black))",
					"--normal-text": "hsl(var(--white))",
					"--normal-border": "hsl(var(--border))",
					"--border-radius": "var(--radius)",
				} as React.CSSProperties
			}
			{...props}
		/>
	);
};

export { Toaster };

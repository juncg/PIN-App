"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { P } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useRef, useState } from "react";

type SwitchProps = ComponentProps<typeof SwitchPrimitive.Root> & {
	innerTextUnchecked?: string;
	innerTextChecked?: string;
};

export function Switch({
	className,
	innerTextUnchecked,
	innerTextChecked,
	checked: controlledChecked,
	onCheckedChange,
	defaultChecked,
	...props
}: SwitchProps) {
	const thumbRefChecked = useRef<HTMLSpanElement>(null);
	const thumbRefUnchecked = useRef<HTMLSpanElement>(null);
	const [maxThumbWidth, setMaxThumbWidth] = useState(80);
	const [checked, setChecked] = useState<boolean>(
		controlledChecked !== undefined ? Boolean(controlledChecked) : Boolean(defaultChecked)
	);

	useEffect(() => {
		if (controlledChecked !== undefined) {
			setChecked(Boolean(controlledChecked));
		}
	}, [controlledChecked]);

	useEffect(() => {
		const wChecked = thumbRefChecked.current?.offsetWidth || 0;
		const wUnchecked = thumbRefUnchecked.current?.offsetWidth || 0;
		const max = Math.max(wChecked, wUnchecked);

		if (max > 0) setMaxThumbWidth(max);
	}, [innerTextChecked, innerTextUnchecked]);

	const handleChange = (next: boolean) => {
		if (controlledChecked === undefined) {
			setChecked(next);
		}

		onCheckedChange?.(next);
	};

	return (
		<>
			<span className="fixed invisible pointer-events-none" aria-hidden="true">
				<span
					ref={thumbRefChecked}
					className="inline-flex items-center justify-center w-auto min-w-[5rem] px-4 py-1"
				>
					<P className="font-bold">{innerTextChecked}</P>
				</span>
			</span>

			<span className="fixed invisible pointer-events-none" aria-hidden="true">
				<span
					ref={thumbRefUnchecked}
					className="inline-flex items-center justify-center w-auto min-w-[5rem] px-4 py-1"
				>
					<P className="font-bold">{innerTextUnchecked}</P>
				</span>
			</span>

			<SwitchPrimitive.Root
				data-slot="switch"
				className={cn(
					"peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-primary focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-auto min-h-[2.5rem] shrink-0 items-center rounded-md shadow-md transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 p-1",
					className
				)}
				style={{ width: `${maxThumbWidth * 1.3 + 8}px` }}
				checked={checked}
				onCheckedChange={handleChange}
				defaultChecked={defaultChecked}
				{...props}
			>
				<SwitchPrimitive.Thumb
					data-slot="switch-thumb"
					className={cn(
						"pointer-events-none flex items-center justify-center h-full min-w-[5rem] px-4 py-1 rounded-md ring-0 transition-all duration-200 data-[state=checked]:translate-x-[30%] data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-ternary data-[state=unchecked]:bg-secondary"
					)}
					style={{ width: `${maxThumbWidth}px` }}
				>
					<P className="font-bold text-primary">{checked ? innerTextChecked : innerTextUnchecked}</P>
				</SwitchPrimitive.Thumb>
			</SwitchPrimitive.Root>
		</>
	);
}

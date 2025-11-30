"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";

import { P } from "@/components/ui-custom/typography";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useLayoutEffect, useRef, useState } from "react";

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

	useLayoutEffect(() => {
		const wChecked = thumbRefChecked.current?.offsetWidth || 0;
		const wUnchecked = thumbRefUnchecked.current?.offsetWidth || 0;
		const max = Math.max(wChecked, wUnchecked);

		if (max > 0 && Math.abs(max - maxThumbWidth) > 1) {
			setMaxThumbWidth(max);
		}
	}, [innerTextChecked, innerTextUnchecked, maxThumbWidth]);

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
					"peer bg-primary-unchanged border-[3px] border-secondary-unchanged inline-flex h-auto min-h-[2.5rem] shrink-0 items-center rounded-[10px] disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				style={{ width: `${maxThumbWidth * 1.2 + 6}px` }} // Expande el switch un 30% + (borde derecho en px + borde izquierdo en px) para que el interior, el thumb, se desplace
				checked={checked}
				onCheckedChange={handleChange}
				defaultChecked={defaultChecked}
				{...props}
			>
				<SwitchPrimitive.Thumb
					data-slot="switch-thumb"
					className={cn(
						"pointer-events-none flex items-center justify-center h-full min-w-[5rem] px-4 py-1 rounded-[10px] border-[3px] border-primary-unchanged transition-[transform,background-color] duration-200 data-[state=checked]:translate-x-[20%] data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-ternary data-[state=unchecked]:bg-secondary-unchanged"
					)}
					style={{ 
						width: `${maxThumbWidth}px`,
						willChange: 'transform',
						transform: checked ? 'translateX(20%)' : 'translateX(0)'  // Explicit transform
					}}
				>
					<P className="font-bold text-primary-unchanged">
						{checked ? innerTextChecked : innerTextUnchecked}
					</P>
				</SwitchPrimitive.Thumb>
			</SwitchPrimitive.Root>
		</>
	);
}

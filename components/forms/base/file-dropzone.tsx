"use client";

import { Button } from "@/components/ui-custom/button";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../ui-custom/input";
import { Label } from "../../ui-custom/label";

interface FileDropzoneProps {
	value: File[];
	onChange: (files: File[]) => void;
	maxFiles?: number;
	disabled?: boolean;
	accept?: string;
	label?: string;
	required?: boolean;
}

export default function FileDropzone({
	value,
	onChange,
	maxFiles = 5,
	disabled = false,
	accept = "image/*",
	label = "Imágenes",
	required = false,
}: FileDropzoneProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [isDragActive, setIsDragActive] = useState(false);
	const [previews, setPreviews] = useState<string[]>([]);

	useEffect(() => {
		// Revoke previous previews
		previews.forEach((p) => {
			try {
				URL.revokeObjectURL(p);
			} catch {}
		});

		const urls = value.map((f) => URL.createObjectURL(f));
		setPreviews(urls);

		return () => {
			urls.forEach((u) => {
				try {
					URL.revokeObjectURL(u);
				} catch {}
			});
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value.join?.("-")]);

	function handleFiles(files: FileList | null) {
		if (!files) return;
		const newFiles = Array.from(files);
		const combined = [...value, ...newFiles].slice(0, maxFiles);
		onChange(combined);
	}

	function onDrop(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragActive(false);
		handleFiles(e.dataTransfer.files);
	}

	function onDragOver(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
		setIsDragActive(true);
	}

	function onDragLeave() {
		setIsDragActive(false);
	}

	function removeAt(index: number) {
		onChange(value.filter((_, i) => i !== index));
	}

	return (
		<div className="grid gap-2">
			<Label>
				{label}
				{required && <Label className="!text-destructive">*</Label>}
			</Label>
			<div
				className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border p-6 transition-colors ${
					isDragActive ? "border-black bg-black/5" : "border-dashed border-lightgrey/40"
				}`}
				onDrop={onDrop}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onClick={() => inputRef.current?.click()}
				role="button"
				aria-disabled={disabled}
			>
				<p className="text-center text-sm text-lightgrey">
					Arrastra y suelta tus imágenes aquí, o haz clic para seleccionar (máx. {maxFiles})
				</p>
				<Input
					ref={inputRef}
					id="images"
					type="file"
					accept={accept}
					multiple
					disabled={disabled}
					className="absolute inset-0 h-full w-full opacity-0 pointer-events-none"
					onChange={(e) => handleFiles(e.target.files)}
				/>
			</div>

			{value.length > 0 && (
				<div className="grid grid-cols-3 gap-2 mt-2">
					{value.map((file, idx) => (
						<div key={idx} className="relative rounded overflow-hidden bg-lightgrey/5">
							<img src={previews[idx]} alt={file.name} className="h-24 w-full object-contain" />
							<Button
								type="button"
								onClick={(ev) => {
									ev.stopPropagation();
									removeAt(idx);
								}}
								className="absolute right-1 top-1 rounded-full px-1 text-xs"
							>
								Eliminar
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

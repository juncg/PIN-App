import { useState } from "react";
import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export default {
	title: "UI/Popover",
	component: Popover,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline">Open Popover</Button>
				</PopoverTrigger>
				<PopoverContent>
					<div className="grid gap-4">
						<div className="space-y-2">
							<h4 className="font-medium leading-none">Dimensions</h4>
							<p className="text-sm text-lightgrey">Set the dimensions for the layer.</p>
						</div>
						<div className="grid gap-2">
							<div className="grid grid-cols-3 items-center gap-4">
								<label htmlFor="width">Width</label>
								<input id="width" defaultValue="100%" className="col-span-2 h-8" />
							</div>
							<div className="grid grid-cols-3 items-center gap-4">
								<label htmlFor="maxWidth">Max. width</label>
								<input id="maxWidth" defaultValue="300px" className="col-span-2 h-8" />
							</div>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		);
	},
};

export const WithAnchor = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<div className="flex flex-col items-center gap-4">
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline">Open Popover</Button>
					</PopoverTrigger>
					<PopoverContent align="start">
						<p>This popover is aligned to the start.</p>
					</PopoverContent>
				</Popover>
			</div>
		);
	},
};

import { useState } from "react";
import { Button } from "../button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../dialog";

export default {
	title: "UI/Dialog",
	component: Dialog,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">Open Dialog</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Dialog Title</DialogTitle>
						<DialogDescription>This is a description of the dialog content.</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<p>Dialog content goes here.</p>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Cancel
						</Button>
						<Button onClick={() => setOpen(false)}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};

export const WithoutCloseButton = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">Open Dialog (No Close)</Button>
				</DialogTrigger>
				<DialogContent showCloseButton={false}>
					<DialogHeader>
						<DialogTitle>No Close Button</DialogTitle>
						<DialogDescription>This dialog has no close button in the corner.</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<p>You must use the footer buttons to close.</p>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setOpen(false)}>
							Close
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	},
};

import { useState } from "react";
import { Button } from "../button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "../sheet";

export default {
	title: "UI/Sheet",
	component: Sheet,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Right = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="outline">Open Right Sheet</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>Edit profile</SheetTitle>
						<SheetDescription>
							Make changes to your profile here. Click save when you're done.
						</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="name" className="text-right">
								Name
							</label>
							<input id="name" value="Pedro Duarte" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<label htmlFor="username" className="text-right">
								Username
							</label>
							<input id="username" value="@peduarte" className="col-span-3" />
						</div>
					</div>
					<SheetFooter>
						<Button type="submit" onClick={() => setOpen(false)}>
							Save changes
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	},
};

export const Left = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="outline">Open Left Sheet</Button>
				</SheetTrigger>
				<SheetContent side="left">
					<SheetHeader>
						<SheetTitle>Left Sheet</SheetTitle>
						<SheetDescription>This sheet slides in from the left.</SheetDescription>
					</SheetHeader>
					<div className="py-4">
						<p>Content here.</p>
					</div>
					<SheetFooter>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	},
};

export const Top = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="outline">Open Top Sheet</Button>
				</SheetTrigger>
				<SheetContent side="top">
					<SheetHeader>
						<SheetTitle>Top Sheet</SheetTitle>
						<SheetDescription>This sheet slides in from the top.</SheetDescription>
					</SheetHeader>
					<div className="py-4">
						<p>Content here.</p>
					</div>
					<SheetFooter>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	},
};

export const Bottom = {
	render: () => {
		const [open, setOpen] = useState(false);
		return (
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="outline">Open Bottom Sheet</Button>
				</SheetTrigger>
				<SheetContent side="bottom">
					<SheetHeader>
						<SheetTitle>Bottom Sheet</SheetTitle>
						<SheetDescription>This sheet slides in from the bottom.</SheetDescription>
					</SheetHeader>
					<div className="py-4">
						<p>Content here.</p>
					</div>
					<SheetFooter>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	},
};

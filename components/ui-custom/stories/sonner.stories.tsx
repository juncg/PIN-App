import 'sonner/dist/styles.css';
import { toast } from "sonner";
import { Button } from "../button";
import { Toaster } from "../sonner";

export default {
	title: "UI/Sonner",
	component: Toaster,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
};

export const Default = {
	render: () => (
		<div className="space-x-2">
			<Toaster />
			<Button
				variant="outline"
				onClick={() =>
					toast("Event has been created", {
						description: "Sunday, December 03, 2023 at 9:00 AM",
						action: {
							label: "Undo",
							onClick: () => console.log("Undo"),
						},
					})
				}
			>
				Show Toast
			</Button>
			<Button variant="outline" onClick={() => toast.success("Success message")}>
				Success
			</Button>
			<Button variant="outline" onClick={() => toast.error("Error message")}>
				Error
			</Button>
			<Button variant="outline" onClick={() => toast.warning("Warning message")}>
				Warning
			</Button>
			<Button variant="outline" onClick={() => toast.info("Info message")}>
				Info
			</Button>
			<Button variant="outline" onClick={() => toast.loading("Loading...")}>
				Loading
			</Button>
		</div>
	),
};

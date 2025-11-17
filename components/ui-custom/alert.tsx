import { AlertCircle, CheckCircle } from "lucide-react";
import { ComponentProps } from "react";
import { AlertDescription, Alert as DefaultAlert } from "../ui/alert";

type TAlert = "Success" | "Error" | "Warning" | "Info";

export interface IAlert {
	type: TAlert;
	message: string;
}

export function Alert({ className, type, message, ...props }: ComponentProps<"div"> & IAlert) {
	return (
		<DefaultAlert
			className={`mb-4 ${type === "Success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
		>
			{type === "Success" ? (
				<CheckCircle className="h-4 w-4 text-green-600" />
			) : (
				<AlertCircle className="h-4 w-4 text-red-600" />
			)}
			<AlertDescription className={type === "Success" ? "text-green-800" : "text-red-800"}>
				{message}
			</AlertDescription>
		</DefaultAlert>
	);
}

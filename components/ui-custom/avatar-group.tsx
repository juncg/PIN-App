import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

type TAvatarShape = "Rounded" | "Squared";

interface IAvatarGroup {
	avatarImages?: string[];
	shape?: TAvatarShape;
	inclined?: boolean;
}

export function AvatarGroup({ avatarImages, shape = "Rounded", inclined = false }: IAvatarGroup) {
	return (
		<div className="*:data-[slot=avatar]:ring-white flex -space-x-4 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
			<Avatar
				className={`${shape === "Rounded" && "rounded-full"} ${inclined && "rotate-[30deg] overflow-visible"}`}
			>
				<AvatarImage
					className={`border border-darkmode ${shape === "Rounded" ? "rounded-full" : "rounded-[5px]"}`}
					src={avatarImages?.[0] || "/placeholder.png"}
				/>
			</Avatar>

			<Avatar
				className={`${shape === "Rounded" && "rounded-full"} ${inclined && "rotate-[30deg] overflow-visible"}`}
			>
				<AvatarImage
					className={`border border-darkmode ${shape === "Rounded" ? "rounded-full" : "rounded-[5px]"}`}
					src={avatarImages?.[1] || "/placeholder.png"}
				/>
			</Avatar>

			<Avatar
				className={`${shape === "Rounded" && "rounded-full"} ${inclined && "rotate-[30deg] overflow-visible"}`}
			>
				<AvatarImage
					className={`border border-darkmode ${shape === "Rounded" ? "rounded-full" : "rounded-[5px]"}`}
					src={avatarImages?.[2] || "/placeholder.png"}
				/>
			</Avatar>

			<Avatar
				className={`${shape === "Rounded" && "rounded-full"} ${inclined && "rotate-[30deg] overflow-visible"}`}
			>
				<AvatarImage className={`${shape === "Rounded" ? "rounded-full" : "rounded-[5px]"}`} src="" />
				<AvatarFallback
					className={`border border-white bg-darkmode ${
						shape === "Rounded" ? "rounded-full" : "rounded-[5px]"
					}`}
				>
					<Plus className={`${inclined && "rotate-[-30deg]"} !h-4`} />
				</AvatarFallback>
			</Avatar>
		</div>
	);
}

import { cn } from "@/lib/utils";

interface IconProps {
	svgName?: string;
	alt?: string;
	className?: string;
}

export function Icon({ svgName, alt = "", className }: IconProps) {
	if (svgName) {
		return <img src={`/icons/${svgName}.svg`} alt={alt} className={cn(className, "text-white w-5 h-5")} />;
	}
}

interface IconProps {
	svgName?: string;
	alt?: string;
	className?: string;
}

export function Icon({ svgName, alt = "", className }: IconProps) {
	if (svgName) {
		return <img src={`/icons/${svgName}.svg`} alt={alt} className={className} />;
	}
}

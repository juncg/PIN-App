interface IconProps {
	svgName?: string;
	alt?: string;
	className?: string;
}

export function Icon({ svgName, alt = "", className }: IconProps) {
	if (svgName === "keyboard_arrow_left") {
		// Inline SVG for keyboard_arrow_left, fill uses currentColor
		return (
			<svg
				width="48"
				height="48"
				viewBox="0 0 48 48"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
				aria-label={alt}
			>
				<path
					d="M21.5999 24L30.7999 14.8L27.9999 12L15.9999 24L27.9999 36L30.7999 33.2L21.5999 24Z"
					fill="currentColor"
				/>
			</svg>
		);
	}
	// Fallback to <img> for other icons
	if (svgName) {
		return <img src={`/icons/${svgName}.svg`} alt={alt} className={className} />;
	}
	return null;
}

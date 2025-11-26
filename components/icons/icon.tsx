import React from "react";

interface IconProps {
	svgContent?: React.ReactNode; // Para pasar contenido SVG directamente
	svgPath?: string; // Ruta para cargar un archivo SVG local
	alt?: string; // Texto alternativo para accesibilidad
	className?: string; // Clases adicionales para estilos
}

export function Icon({ svgContent, svgPath, alt = "", className }: IconProps) {
	if (svgPath) {
		return <img src={svgPath} alt={alt} className={className} />;
	}

	return (
		<svg className={className} role="img" aria-label={alt}>
			{svgContent}
		</svg>
	);
}

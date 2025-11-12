export function GetRelativeTime(dateString: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
	const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
	const diffInMonths = Math.floor(diffInDays / 30);
	const diffInYears = Math.floor(diffInDays / 365);

	if (diffInMinutes < 1) return "Ahora mismo";
	if (diffInMinutes < 60) return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
	if (diffInHours < 24) return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
	if (diffInDays < 30) return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
	if (diffInMonths < 12) return `Hace ${diffInMonths} ${diffInMonths === 1 ? "mes" : "meses"}`;
	return `Hace ${diffInYears} ${diffInYears === 1 ? "año" : "años"}`;
}

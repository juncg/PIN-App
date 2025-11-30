export function formatFullDateWithOrdinal(date = new Date()) {
	const nextDay = new Date(date);
	nextDay.setDate(nextDay.getDate() + 3); // adjust days if needed

	const day = nextDay.getDate();

	// Determine ordinal suffix
	const suffix =
		day % 10 === 1 && day !== 11
			? "st"
			: day % 10 === 2 && day !== 12
			? "nd"
			: day % 10 === 3 && day !== 13
			? "rd"
			: "th";

	// Format weekday, month, year
	const formatter = new Intl.DateTimeFormat("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	// Format the adjusted date
	const base = formatter.format(nextDay);

	// Insert ordinal suffix before the comma after the day
	return base.replace(/(\d+)/, `$1${suffix}`);
}

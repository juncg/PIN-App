"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppNameLink() {
	const currentRoute = usePathname();

	return (
		<Link
			className="font-semibold text-lg absolute left-1/2 -translate-x-1/2"
			href={currentRoute === "/home" ? "/home" : "/"}>
			Deal&Buy
		</Link>
	);
}

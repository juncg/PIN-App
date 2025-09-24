import Link from "next/link";
import { AuthButton } from "../auth/auth-buttons";
import { ThemeSwitcher } from "../ui/theme-switcher";

export function Header() {
	return (
		<header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<Link className="font-semibold" href={"/"}>
					Deal&Buy
				</Link>

				<div className="flex gap-4 items-center">
					<AuthButton />

					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
}

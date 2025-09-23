import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { AuthButton } from "../auth-button";
import { EnvVarWarning } from "../env-var-warning";
import { ThemeSwitcher } from "../theme-switcher";

export function Header() {
	return (
		<header className="w-full flex justify-center border-b border-b-foreground/10 h-16">
			<div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
				<Link className="font-semibold" href={"/"}>
					App Megamillonaria
				</Link>

				<div className="flex gap-4 items-center">
					{!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}

					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
}

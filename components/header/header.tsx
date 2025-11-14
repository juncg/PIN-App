import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import Link from "next/link";
import { AuthButton } from "../auth/auth-buttons";
import { SearchGeneral } from "../search/search-general/search-general";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeSwitcher } from "../ui/theme-switcher";

export function Header() {
	return (
		<header className="sticky top-0 z-30 w-full flex border-b border-b-foreground/10 h-16 bg-background">
			<div className="w-full flex items-center px-4 md:px-6 relative">
				<div className="flex items-center gap-2">
					<SidebarTrigger />
					<Link className="font-semibold text-lg" href={"/home"}>
						Deal&Buy
					</Link>
				</div>

				<SearchGeneral />

				<div className="flex gap-2 md:gap-4 items-center ml-auto">
					<AuthButton />
					<ThemeSwitcher />
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}

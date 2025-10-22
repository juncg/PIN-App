import { AuthButton } from "../auth/auth-buttons";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { AppNameLink } from "./app-name-link";
import { SidebarWrapper } from "./sidebar-wrapper";

export function Header() {
	return (
		<header className="sticky top-0 z-30 w-full flex border-b border-b-foreground/10 h-16 bg-background">
			<div className="w-full flex justify-between items-center px-4 md:px-6 relative">
				<div className="flex items-center gap-2">
					<SidebarWrapper />
				</div>

				<AppNameLink />

				<div className="flex gap-2 md:gap-4 items-center">
					<AuthButton />
					<ThemeSwitcher />
				</div>
			</div>
		</header>
	);
}

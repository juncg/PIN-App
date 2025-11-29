import { LocaleSwitcher } from "@/components/ui-custom/locale-switcher";
import Link from "next/link";
import { AuthButton } from "../auth/auth-buttons";
import { SearchGeneral } from "../search/search-general/search-general";
import { SidebarTrigger } from "../ui-custom/sidebar";
import { H3 } from "../ui-custom/typography";

export function Header() {
	return (
		<header className="sticky top-0 z-30 w-full flex border-b-2 border-b-white bg-darkmode h-16">
			<div className="w-full flex items-center px-4 md:px-6 relative">
				<div className="flex items-center gap-8">
					<SidebarTrigger className="w-8 h-8" />

					<Link className="flex items-center" href={"/home"}>
						<H3>Deal&Buy.</H3>
					</Link>
				</div>

				<SearchGeneral />

				<div className="flex gap-2 md:gap-4 items-center ml-auto">
					<AuthButton />
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}

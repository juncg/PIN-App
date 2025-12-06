import { LocaleSwitcher } from "@/components/ui-custom/locale-switcher";
import Link from "next/link";
import { Suspense } from "react";
import { AuthButton } from "../auth/auth-buttons";
import { SearchGeneral } from "../search/search-general/search-general";
import { SidebarTrigger } from "../ui-custom/sidebar";
import { H3 } from "../ui-custom/typography";

export function Header() {
	return (
		<header className="sticky top-0 z-30 w-full flex bg-darkmode h-16 !border-b-[2px]">
			<div className="w-full flex items-center px-4 md:px-5 relative">
				<div className="flex items-center gap-6">
					<SidebarTrigger className="w-10 h-10" />

					<Link className="flex items-center" href={"/home"}>
						<H3>
							Deal&Buy<span className="text-chernobyl">.</span>
						</H3>
					</Link>
				</div>

				<Suspense fallback={<div className="w-8 h-8" />}>
					<SearchGeneral />
				</Suspense>

				<div className="flex gap-2 md:gap-4 items-center ml-auto">
					<AuthButton />
					<Suspense fallback={<div className="w-8 h-8" />}>
						<LocaleSwitcher />
					</Suspense>
				</div>
			</div>
		</header>
	);
}

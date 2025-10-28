"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const locales = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
];

export function LocaleSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLocale = searchParams.get('locale') || 'en';

    const handleLocaleChange = (newLocale: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('locale', newLocale);
        
        // Set cookie
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
        
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    {locales.find(l => l.code === currentLocale)?.label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup value={currentLocale} onValueChange={handleLocaleChange}>
                    {locales.map((locale) => (
                        <DropdownMenuRadioItem key={locale.code} value={locale.code}>
                            {locale.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
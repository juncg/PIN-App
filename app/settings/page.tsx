import { Button } from "@/components/ui-custom/button";
import { NEXT_PUBLIC_DEBUG_MODE } from "@/lib/constants";
import { ISearchParams } from "@/types";
import Link from "next/link";

export default function Settings({ searchParams }: { searchParams: Promise<ISearchParams> }) {
	return (
		<div>
			{NEXT_PUBLIC_DEBUG_MODE && (
				<Link href={"/security-test"}>
					<Button>Tests de seguridad</Button>
				</Link>
			)}
		</div>
	);
}

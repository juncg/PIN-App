import { Switch } from "@/components/ui-custom/switch";
import { H1 } from "@/components/ui-custom/typography";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
	return (
		<section className="flex flex-col items-start gap-4">
			<H1>Deal&Buy</H1>

			<Button>
				<Link href={"/home"}>Ir al inicio</Link>
			</Button>

			<Switch innerTextChecked="Apuntado." innerTextUnchecked="Apuntarme" />
		</section>
	);
}

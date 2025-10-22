import { Button } from "@/components/ui/button";
import { H1 } from "@/components/ui/typography";
import Link from "next/link";

export default function Home() {
	return (
		<section className="flex flex-col items-center">
			<H1>Deal&Buy</H1>
			<Button>
				<Link href={"/home"}>Get Started</Link>
			</Button>
		</section>
	);
}

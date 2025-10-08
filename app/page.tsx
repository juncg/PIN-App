import { H1, H2 } from "@/components/ui/typography";
import Link from "next/link";

export default function Home() {
	return (
		<section className="flex flex-col items-center">
			<H1>Deal&Buy</H1>

			<Link href={"/feed"}>
				<H2>Go to feed</H2>
			</Link>
		</section>
	);
}

import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col items-center">
			<div className="flex-1 w-full flex flex-col gap-20 items-center">
				<Header />

				<Footer />
			</div>
		</main>
	);
}

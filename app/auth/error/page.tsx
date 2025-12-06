import { AuthButtons } from "@/components/auth/auth-buttons";
import { H1, H4 } from "@/components/ui-custom/typography";
import Image from "next/image";

export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
	const params = await searchParams;

	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4 md:p-6">
			<div className="flex flex-col gap-6 w-full max-w-5xl">
				<div className="border-[2px] bg-darkmode flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16 rounded-xl p-10 md:p-12">
					<Image
						src="/dealbuy-logo-dark.svg"
						alt="Logo Deal&Buy"
						width={300}
						height={300}
						className="h-52 w-52"
					/>

					<div className="bg-white border-t-[2px] md:border-t-0 md:border-r-[2px] w-full md:w-auto h-[2px] md:h-40" />

					<div className="flex flex-col gap-4 text-center md:text-left w-full md:w-auto items-center md:items-start">
						<H1>¡Ups, algo ha ido mal!</H1>

						<H4>
							Lo sentimos, ha ocurrido un error {params.error || "no especificado"}, vuelve a intentarlo.
						</H4>

						<AuthButtons className="flex-col sm:flex-row"></AuthButtons>
					</div>
				</div>
			</div>
		</div>
	);
}

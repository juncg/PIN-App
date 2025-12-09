import { Button } from "@/components/ui-custom/button";
import { B1, H1 } from "@/components/ui-custom/typography";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6">
			<div className="border-[2px] bg-darkmode flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16 rounded-xl p-10 md:p-12 max-w-6xl">
				<div className="flex items-center justify-center">
					<Image
						src="/dealbuy-logo-dark.svg"
						alt="Logo Deal&Buy"
						width={300}
						height={300}
						className="h-52 w-52"
					/>
				</div>

				<div className="bg-white border-t-[2px] md:border-t-0 md:border-r-[2px] w-full md:w-auto h-[2px] md:h-60" />

				<div className="flex flex-col gap-6">
					<span className="flex flex-col gap-2">
						<H1 className="text-white">¡Gracias por registrarte!</H1>

						<B1 className="text-white">
							Te has registrado exitosamente. Por favor, revisa tu correo electrónico para confirmar tu
							cuenta antes de iniciar sesión.
						</B1>
					</span>

					<Link href="/auth/login">
						<Button variant="defaultSquared" className="w-full">
							Iniciar sesión.
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}

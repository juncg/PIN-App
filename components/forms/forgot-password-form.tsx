"use client";

import { Button } from "@/components/ui-custom/button";
import { Input } from "@/components/ui-custom/input";
import { Label } from "@/components/ui-custom/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { B1, H1 } from "../ui-custom/typography";

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [email, setEmail] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			// The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
			const { error } = await supabase.auth.resetPasswordForEmail(email, {
				redirectTo: `${window.location.origin}/auth/update-password`,
			});
			if (error) throw error;
			setSuccess(true);
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className={cn(
				"border bg-darkmode flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16 rounded-xl p-10 md:p-12",
				className
			)}
			{...props}
		>
			<Image src="/dealbuy-logo-dark.svg" alt="Logo Deal&Buy" width={300} height={300} className="h-52 w-52" />

			<div className="bg-white border-t-[2px] md:border-t-0 md:border-r-[2px] w-full md:w-auto h-[2px] md:h-40" />

			<div className="flex flex-col gap-4">
				{!success ? (
					<form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
						<span className="flex flex-col gap-2">
							<H1>Reinicia tu contraseña</H1>

							<B1>Escribe tu correo y te enviaremos un link para restablecer tu contraseña</B1>
						</span>

						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>

								<Input
									id="email"
									type="email"
									placeholder="correo@ejemplo.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							{error && <p className="text-sm text-destructive">{error}</p>}

							<Button variant="defaultSquared" type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Enviando..." : "Enviar correo"}
							</Button>
						</div>

						<div className="mt-4 text-center text-sm">
							Ya estas registrado?{" "}
							<Link href="/auth/login" className="underline underline-offset-4">
								Iniciar sesión
							</Link>
						</div>
					</form>
				) : (
					<div className="flex flex-col gap-4 items-center md:items-start">
						<H1>Se ha enviado un enlace para restablecer la contraseña</H1>

						<B1>Dirígete a tu bandeja de correo y comprueba los nuevos correos recibidos</B1>

						<div>
							<Link href="/auth/login">
								<Button>Iniciar sesión.</Button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

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

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;

			window.location.href = "/home";
		} catch (error: unknown) {
			setError(error instanceof Error ? error.message : "An error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className={cn(
				"border bg-darkmode flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16 rounded-xl p-10 md:p-12 max-w-5xl",
				className
			)}
			{...props}
		>
			<div className="flex items-center justify-center">
				<Image
					src="/dealbuy-logo-dark.svg"
					alt="Logo Deal&Buy"
					width={300}
					height={300}
					className="h-52 w-52"
				/>
			</div>

			<div className="bg-white border-t-[2px] md:border-t-0 md:border-r-[2px] w-full md:w-auto h-[2px] md:h-96" />

			<div className="flex flex-col gap-4 md:w-2/3">
				<form onSubmit={handleLogin} className="flex flex-col gap-6">
					<span className="flex flex-col gap-2">
						<H1 className="text-white">Iniciar sesión</H1>

						<B1 className="text-white">Introduce tu correo y contraseña para acceder a tu cuenta</B1>
					</span>

					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="email" className="text-white">
								Email
							</Label>

							<Input
								id="email"
								type="email"
								placeholder="correo@ejemplo.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="password" className="text-white">
									Contraseña
								</Label>
								<Link
									href="/auth/forgot-password"
									className="text-sm text-white underline-offset-4 hover:underline"
								>
									¿Olvidaste tu contraseña?
								</Link>
							</div>

							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						{error && <p className="text-sm text-destructive">{error}</p>}

						<Button variant="defaultSquared" type="submit" className="w-full mt-2" disabled={isLoading}>
							{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
						</Button>
					</div>

					<div className="text-center text-sm text-white">
						¿No tienes una cuenta?{" "}
						<Link href="/auth/sign-up" className="underline underline-offset-4">
							Regístrate
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

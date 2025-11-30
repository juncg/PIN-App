"use client";

import { Button } from "@/components/ui-custom/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { Input } from "@/components/ui-custom/input";
import { Label } from "@/components/ui-custom/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

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
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Login</CardTitle>
					<CardDescription>Introduce tu correo para iniciar sesión</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="password">Contraseña</Label>
									<Link
										href="/auth/forgot-password"
										className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
									>
										¿Has olvidado tu contraseña?
									</Link>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{error && <p className="text-sm text-red-500">{error}</p>}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							¿No tienes una cuenta?{" "}
							<Link href="/auth/sign-up" className="underline underline-offset-4">
								Regístrate
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

"use client";

import { Button } from "@/components/ui-custom/button";
import { Input } from "@/components/ui-custom/input";
import { Label } from "@/components/ui-custom/label";
import { GetFromDatabase, PostToDatabase } from "@/lib/services/general";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { B1, H1 } from "../ui-custom/typography";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [name, setName] = useState("");
	const [surnames, setSurnames] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [birthDate, setBirthDate] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		if (password !== repeatPassword) {
			setError("Passwords do not match");
			setIsLoading(false);
			return;
		}

		const isUsernameAlreadyUsed = await GetFromDatabase({
			tableName: "User",
			select: "username",
			filters: [{ method: "eq", column: "username", value: username }],
		});

		if (isUsernameAlreadyUsed.data && isUsernameAlreadyUsed.data.length > 0) {
			setError("Username ya en uso");
			setIsLoading(false);
			return;
		}

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/home`,
				},
			});
			if (error) throw error;

			const userId = data.user?.id;
			if (!userId) throw new Error("No se pudo obtener el ID del usuario.");

			const result = await PostToDatabase({
				tableName: "User",
				contentJson: {
					id: userId,
					name: name,
					surnames: surnames,
					birth_date: birthDate.toString(),
					username: username,
					banner: null,
					profile_picture: null,
					public_user_follows: true,
					public_forum_follows: true,
					public_petition_subscriptions: true,
					public_offer_susbcriptions: true,
					public_likes: true,
					bio: null,
					followers: 0,
					location: "",
					user_follows: 0,
					forum_follows: 0,
					business_follows: 0,
					posts_liked: 0,
					joined_at: new Date().toISOString(),
				},
			});

			if (!result.error) {
				throw new Error(result.error || "Error al crear el perfil del usuario.");
			}

			window.location.href = "/auth/sign-up-success";
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
			<div className="flex items-center justify-center">
				<Image
					src="/dealbuy-logo-dark.svg"
					alt="Logo Deal&Buy"
					width={300}
					height={300}
					className="h-52 w-52"
				/>
			</div>

			<div className="bg-white border-t-[2px] md:border-t-0 md:border-r-[2px] w-full md:w-auto h-[2px] md:h-[600px]" />

			<div className="flex flex-col gap-4 md:w-2/3">
				<form onSubmit={handleSignUp} className="flex flex-col gap-6">
					<span className="flex flex-col gap-2">
						<H1 className="text-white">Registrarse</H1>

						<B1 className="text-white">Crea una cuenta nueva para acceder a la plataforma</B1>
					</span>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor="name" className="text-white">
								Nombre
							</Label>
							<Input
								id="name"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="surnames" className="text-white">
								Apellidos
							</Label>
							<Input
								id="surnames"
								type="text"
								required
								value={surnames}
								onChange={(e) => setSurnames(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="username" className="text-white">
								Nombre de usuario
							</Label>
							<Input
								id="username"
								type="text"
								required
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

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
							<Label htmlFor="password" className="text-white">
								Contraseña
							</Label>
							<Input
								id="password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="repeat-password" className="text-white">
								Repetir contraseña
							</Label>
							<Input
								id="repeat-password"
								type="password"
								required
								value={repeatPassword}
								onChange={(e) => setRepeatPassword(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						<div className="grid gap-2 md:col-span-2">
							<Label htmlFor="birth-date" className="text-white">
								Fecha de nacimiento
							</Label>
							<Input
								id="birth-date"
								type="date"
								required
								value={birthDate}
								onChange={(e) => setBirthDate(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>
					</div>

					{error && <p className="text-sm text-destructive">{error}</p>}

					<Button variant="defaultSquared" type="submit" className="w-full mt-2" disabled={isLoading}>
						{isLoading ? "Creando tu cuenta..." : "Registrarse"}
					</Button>

					<div className="text-center text-sm text-white">
						¿Ya tienes una cuenta?{" "}
						<Link href="/auth/login" className="underline underline-offset-4">
							Iniciar sesión
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}

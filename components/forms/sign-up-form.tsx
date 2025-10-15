"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateUser, IsUsernameAlreadyUsed } from "@/lib/services/user";

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
	const router = useRouter();

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

		const isUsernameAlreadyUsed = (await IsUsernameAlreadyUsed(username)).exists;
		if (isUsernameAlreadyUsed) {
			setError("Username already in use");
			setIsLoading(false);
			return;
		}

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/feed`,
				},
			});
			if (error) throw error;

			const userId = data.user?.id;
			if (!userId) throw new Error("No se pudo obtener el ID del usuario.");

			const result = await CreateUser({
				id: userId,
				name: name,
				surnames: surnames,
				birth_date: birthDate.toString(),
				username: username,
				banner: null,
				profile_picture: null,
			});

            if (!result.success) {
                throw new Error(result.error || "Error al crear el perfil del usuario.");
            }
			router.refresh();
			router.push("/auth/sign-up-success");
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
					<CardTitle className="text-2xl">Sign up</CardTitle>
					<CardDescription>Create a new account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSignUp}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="name">Nombre</Label>
								<Input
									id="name"
									type="text"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="name">Apellidos</Label>
								<Input
									id="surnames"
									type="text"
									required
									value={surnames}
									onChange={(e) => setSurnames(e.target.value)}
								/>
							</div>
						<div className="grid gap-2">
								
								<Label htmlFor="name">Username</Label>
								<Input
									id="name"
									type="text"
									required
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
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
									<Label htmlFor="password">Password</Label>
								</div>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<div className="flex items-center">
									<Label htmlFor="repeat-password">Repeat Password</Label>
								</div>
								<Input
									id="repeat-password"
									type="password"
									required
									value={repeatPassword}
									onChange={(e) => setRepeatPassword(e.target.value)}
								/>
							</div>
														<div className="grid gap-2">
								<Label htmlFor="birth-date">Fecha de nacimiento</Label>
								<Input
									id="birth-date"
									type="date"
									required
									value={birthDate}
									onChange={(e) => setBirthDate(e.target.value)}
								/>
							</div>
							{error && <p className="text-sm text-red-500">{error}</p>}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating an account..." : "Sign up"}
							</Button>
						</div>
						<div className="mt-4 text-center text-sm">
							Already have an account?{" "}
							<Link href="/auth/login" className="underline underline-offset-4">
								Login
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

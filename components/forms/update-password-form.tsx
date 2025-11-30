"use client";

import { Button } from "@/components/ui-custom/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui-custom/card";
import { Input } from "@/components/ui-custom/input";
import { Label } from "@/components/ui-custom/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleForgotPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = createClient();
		setIsLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.updateUser({ password });
			if (error) throw error;
			// Update this route to redirect to an authenticated route. The user already has an active session.
			router.push("/home");
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
					<CardTitle className="text-2xl">Restablece tu contraseña</CardTitle>
					<CardDescription>Porfavor introduce tu nueva contraseña a continuación.</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleForgotPassword}>
						<div className="flex flex-col gap-6">
							<div className="grid gap-2">
								<Label htmlFor="password">Nueva contraseña</Label>
								<Input
									id="password"
									type="password"
									placeholder="Nueva contraseña"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
							{error && <p className="text-sm text-red-500">{error}</p>}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Guardando..." : "Guardar nueva contraseña"}
							</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

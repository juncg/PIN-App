"use client";

import { Button } from "@/components/ui-custom/button";
import { Input } from "@/components/ui-custom/input";
import { Label } from "@/components/ui-custom/label";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { B1, H1 } from "../ui-custom/typography";

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
		<div
			className={cn(
				"border bg-darkmode flex flex-col md:flex-row items-center justify-between gap-6 md:gap-16 rounded-xl p-10 md:p-12 max-w-5xl",
				className
			)}
			{...props}
		>
			<div className="flex items-center justify-center md:w-1/2">
				<Image
					src="/dealbuy-logo-dark.svg"
					alt="Logo Deal&Buy"
					width={300}
					height={300}
					className="h-52 w-52"
				/>
			</div>

			<div className="bg-white border-t-[2px] md:border-t-0 md:border-r-[2px] w-full md:w-auto h-[2px] md:h-80" />

			<div className="flex flex-col gap-4 md:w-1/2">
				<form onSubmit={handleForgotPassword} className="flex flex-col gap-6">
					<span className="flex flex-col gap-2">
						<H1 className="text-white">Restablece tu contraseña</H1>

						<B1 className="text-white">Por favor introduce tu nueva contraseña a continuación</B1>
					</span>

					<div className="flex flex-col gap-4">
						<div className="grid gap-2">
							<Label htmlFor="password" className="text-white">
								Nueva contraseña
							</Label>

							<Input
								id="password"
								type="password"
								placeholder="Nueva contraseña"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-darkmode text-white border-white/20"
							/>
						</div>

						{error && <p className="text-sm text-destructive">{error}</p>}

						<Button variant="defaultSquared" type="submit" className="w-full mt-2" disabled={isLoading}>
							{isLoading ? "Guardando..." : "Guardar nueva contraseña"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

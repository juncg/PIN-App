import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function Page() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6">
			<div className="w-full max-w-sm">
				<ForgotPasswordForm />
			</div>
		</div>
	);
}

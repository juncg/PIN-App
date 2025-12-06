import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function Page() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-4 md:p-6">
			<div className="flex flex-col gap-6 w-full max-w-5xl">
				<ForgotPasswordForm />
			</div>
		</div>
	);
}

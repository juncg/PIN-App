import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export default function Page() {
	return (
		<div className="flex items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<ForgotPasswordForm />
			</div>
		</div>
	);
}

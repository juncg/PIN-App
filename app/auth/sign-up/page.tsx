import { SignUpForm } from "@/components/forms/sign-up-form";

export default function Page() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center p-6">
			<div className="w-full max-w-6xl">
				<SignUpForm />
			</div>
		</div>
	);
}

import { SignUpForm } from "@/components/forms/sign-up-form";

export default function Page() {
	return (
		<div className="flex items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<SignUpForm />
			</div>
		</div>
	);
}

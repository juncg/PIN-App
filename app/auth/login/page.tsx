import { LoginForm } from "@/components/forms/login-form";

export default function Page() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}

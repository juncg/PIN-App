import { UpdatePasswordForm } from "@/components/forms/update-password-form";

export default function Page() {
	return (
		<div className="flex items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<UpdatePasswordForm />
			</div>
		</div>
	);
}
